import dotenv from "dotenv";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {Ollama} from "@langchain/ollama";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {createRetriever} from "../retriever/retriever";
import {AIMessage, BaseMessage, HumanMessage} from "@langchain/core/messages";
import {RunnableSequence} from "@langchain/core/runnables";
import {formatDocumentsAsString} from "langchain/util/document";

dotenv.config();

export default class RagService {

    private readonly systemPrompt: string = `You are an assistant for question-answering tasks. Your name is ${process.env['ASSISTANT_NAME'] || 'Assistant'}. 
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
     `;

    private readonly qcSystemPrompt = `Given a chat history and the latest user question which might reference context in the chat history, 
    formulate a standalone question in ${process.env['LANGUAGE'] || 'english'} which can be understood without the chat history. Do NOT answer question, just reformulate it if needed and otherwise return it as is.
    Just reply with the question you want to ask, don't add anything else`;

    private readonly llm: Ollama;

    private readonly outputParser: StringOutputParser;

    chatHistory: BaseMessage[] = [];

    constructor() {

        this.llm = new Ollama(
            {
                model: process.env['LLM_MODEL'] || 'llama3',
                temperature: 0.2,
                baseUrl: 'host.docker.internal'
            }
        );

        this.outputParser = new StringOutputParser();

    }

    private async generateContextualizedQuestion(question: string, chatHistory: BaseMessage[]) {

        const qcPrompt = ChatPromptTemplate.fromMessages([
            ["system", this.qcSystemPrompt],
            new MessagesPlaceholder("chat_history"),
            ["human", "{question}"]
        ]);

        const qcChain = RunnableSequence.from([
            qcPrompt,
            this.llm,
            this.outputParser
        ]);

        const contextualizedQuestion = await qcChain.invoke({
            question,
            chat_history: chatHistory,
        });

        return contextualizedQuestion;
    }

    async answer(question: string) {
        let contextualizedQuestion;

        if (this.chatHistory.length > 0) {
            contextualizedQuestion = await this.generateContextualizedQuestion(question, this.chatHistory);
        }

        this.chatHistory.push(new HumanMessage(question))

        const prompt = ChatPromptTemplate.fromMessages([
            ["system", this.systemPrompt],
            ["human", "{question}"]
        ]);

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
            },
            prompt,
            this.llm,
            this.outputParser
        ]);

        const answer = await generationChain.invoke({question: contextualizedQuestion || question});

        this.chatHistory.push(new AIMessage(answer))

        return answer;
    }
}
