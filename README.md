Here's the rewritten README file for the project:

```markdown
# ChatGPT Chatbot for PDF Files

Create a ChatGPT chatbot using GPT-4 API to answer questions from multiple large PDF files. This project uses LangChain, Pinecone, TypeScript, OpenAI, and Next.js to build a scalable AI chatbot.

## Table of Contents

- [Development](#development)
  - [Clone the Repository](#clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Set up Environment Variables](#set-up-environment-variables)
  - [Configure Pinecone Namespace](#configure-pinecone-namespace)
  - [Update Chat Model](#update-chat-model)
- [Ingest PDF Files](#ingest-pdf-files)
- [Run the App](#run-the-app)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

## Development

### Clone the Repository

```bash
git clone [github https url]
```

### Install Dependencies

```bash
pnpm install
```

### Set up Environment Variables

1. Copy `.env.example` to create a new `.env` file.

2. Fill in the required API keys, environment, and index name from [OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key) and [Pinecone](https://pinecone.io/).

Example `.env` file:

```
OPENAI_API_KEY=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=
```

### Configure Pinecone Namespace

In the `config` folder, replace the `PINECONE_NAME_SPACE` with the desired `namespace` for storing your embeddings on Pinecone when you run `pnpm run ingest`. This namespace will be used for queries and retrieval later.

### Update Chat Model

In `utils/makechain.ts`, change the `QA_PROMPT` for your own use case. Change `modelName` in `new OpenAIChat` to `gpt-3.5-turbo` if you don't have access to `gpt-4`. Please verify outside this repo that you have access to `gpt-4`, otherwise, the application will not work with it.

## Ingest PDF Files

1. Add your PDF files or folders containing PDF files inside the `docs` folder.

2. Run the following script to ingest and embed your docs:

```bash
npm run ingest
```

3. Check the Pinecone dashboard to verify your namespace and vectors have been added.

## Run the App

After successfully adding the embeddings and content to Pinecone, run the app:

```bash
pnpm run dev
```

Launch the local development environment and type a question in the chat interface.

## Troubleshooting

Refer to the `issues` and `discussions` sections of this repo for solutions. If you encounter errors, follow the general troubleshooting steps provided in this README.

## Credits

The frontend of this repo is inspired by [langchain-chat-nextjs](https://github.com/zahidkhawaja/langchain-chat-nextjs).
```
