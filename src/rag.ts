import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import { Ollama } from "@langchain/ollama";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {createRetriever} from "./services/retriever/retriever";
import {RunnableSequence} from "@langchain/core/runnables";
import {formatDocumentsAsString} from "langchain/util/document";
import {chat, ChatHandler} from "./utils/chat";
import {BaseMessage, AIMessage, HumanMessage} from "@langchain/core/messages";

import dotenv from "dotenv";
dotenv.config();

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `You are an assistant for question-answering tasks. Your name is ${process.env['ASSISTANT_NAME'] || 'Assistant'}. 
        Here are the rules for answering the question:
        1) Answer only in ${process.env['LANGUAGE'] || 'english'} when it is possible unless otherwise specified by the user. More technical terms can remain in the original language.
        2) The answer must be relevant to the question asked and as complete as possible.
        3) Be very careful, the question you have to answer is not in the context or even in the chat history, it is only the last question asked by the human.
        4) If you don't know the answer, just say that you don't know.
        5) The provided context may include both relevant and irrelevant information. You should focus primarily on what is clearly related to the current question.
        6) If the question refers to a specific topic (e.g. a project, a person, a product, a responsibility), include all the context that **is reasonably associated with that topic**, even if it comes in multiple parts or uses slightly different wording.
        7) Ignore unrelated topics, other projects, or unrelated roles—even if they appear in the context.
        8) Do not infer or assume anything that is not supported by the context.
        9) Your answers should be concise, accurate, and focused.

        Use the following pieces of retrieved context to answer the question.
        Start Context: {context}
        End Context.
     `],
    // new MessagesPlaceholder("chat_history"),
    ["human", "{question}"]
]);

const llm = new Ollama(
    {
        model: process.env['LLM_MODEL'] || 'llama3',
        temperature: 0.2,
    }
);

const outputParser = new StringOutputParser();

const retriever = await createRetriever();

const retrievalChain = RunnableSequence.from([
    (input) => input.question,
    retriever,
    formatDocumentsAsString
]);

const generationChain = RunnableSequence.from([
    {
        question: (input) => input.question,
        context: retrievalChain,
        //chat_history: (input) => input.chat_history
    },
    prompt,
    llm,
    outputParser
]);


const qcSystemPrompt = `Given a chat history and the latest user question which might reference context in the chat history,
formulate a standalone question which can be understood without the chat history. Do NOT answer question, just reformulate it
if needed and otherwise return it as is.`;

const qcPrompt = ChatPromptTemplate.fromMessages([
    ["system", qcSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"]
]);

const qcChain = RunnableSequence.from([
    qcPrompt,
    llm,
    outputParser
]);

const chatHistory: BaseMessage[] = [];

const chatHandler: ChatHandler = async (question: string) => {

    let contextualizedQuestion = null;

    if (chatHistory.length > 0) {
        contextualizedQuestion = await qcChain.invoke({
            question,
            chat_history: chatHistory,
        })
    }

    return {
        answer: generationChain.stream({
            question: contextualizedQuestion || question,
            //chat_history: chatHistory,
        }),
        answerCallBack: async (answerText: string) => {
            chatHistory.push(new HumanMessage(contextualizedQuestion || question));
            chatHistory.push(new AIMessage(answerText));
        }
    }
}

chat(chatHandler);
