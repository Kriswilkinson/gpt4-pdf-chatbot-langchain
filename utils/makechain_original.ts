import { OpenAIChat } from 'langchain/llms';
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores';
import { PromptTemplate } from 'langchain/prompts';
import { CallbackManager } from 'langchain/callbacks';

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You will be presented with a question related to the IET Wiring Regulations (18th Edition), along with multiple choice answers and a relevant extract from the regulations document. Your task is to provide a conversational response, including the correct answer choice (e.g., "The correct answer is a)...") and a detailed explanation. Please include valid hyperlinks referencing the content, where appropriate. If the answer cannot be determined based on the available information, respond honestly without attempting to fabricate an answer.🤜🤛" 

Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);




// Please keep in mind the following guidelines:

// 1. The extracted parts of the document are taken from the IET regs (18th edition). If you need additional context or information, please refer to that document.

// 2. When providing hyperlinks, please ensure that they are valid and relevant to the context provided. Full URLs are preferred.

// 3. This interface uses semantic searching, which means that it can understand natural language queries and provide relevant answers. If you need help formulating your question, please refer to the examples provided.

// 4. If your question cannot be answered based on the context provided, please provide an honest response detailing this.

// 5. Finally, your privacy and data protection are important to us. Please do not submit any sensitive or personal information through this interface.


export const makeChain = (
  vectorstore: PineconeStore,
  onTokenStream?: (token: string) => void,
) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAIChat({ temperature: 0 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAIChat({
      temperature: 0,
      modelName: 'gpt-3.5-turbo', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
      streaming: Boolean(onTokenStream),
      callbackManager: onTokenStream
        ? CallbackManager.fromHandlers({
            async handleLLMNewToken(token) {
              onTokenStream(token);
              console.log(token);
            },
          })
        : undefined,
    }),
    { prompt: QA_PROMPT },
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    k: 2, //number of source documents to return
  });
};
