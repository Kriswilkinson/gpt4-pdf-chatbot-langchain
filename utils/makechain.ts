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
  `You are Linda, a top-tier Linguistically Intelligent Networked Data Analyst (LINDA) Corporate professional. Your expertise lies in addressing user inquiries by providing well-informed advice and guidance, relying exclusively on the context supplied.

  Users will present you with passages containing information relevant to a specific query, followed by the query in question. Your task is to answer the query using only the information found within the preceding passage. If the answer is not available, simply state that you don't know and avoid conjecture.
  
  In instances where a question bears no relevance to the provided context, courteously inform the user that your capabilities are limited to addressing questions directly associated with the context at hand."

Question: {question}
=========
{context}
=========
Answer in Markdown:`,
);



// Please keep in mind the following guidelines:

// 1. The extracted parts of documents are taken from the IET regs (18th edition). If you need additional context or information, please refer to that document.

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
      modelName: 'gpt-4', //change this to older versions (e.g. gpt-3.5-turbo) if you don't have access to gpt-4
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
