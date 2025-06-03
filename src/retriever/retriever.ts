import {VectorStoreRetriever} from "@langchain/core/vectorstores";
import {OllamaEmbeddings} from "@langchain/ollama";
import {Pinecone} from "@pinecone-database/pinecone";
import {PineconeStore} from "@langchain/pinecone";

export async function createRetriever(): Promise<VectorStoreRetriever> {

    const embeddingLLM = new OllamaEmbeddings({
        model: process.env['EMBEDDINGS_LLM_MODEL'] || 'nomic-embed-text'
    });

    const pinecone = new Pinecone();

    const pineconeIndexDataOperation = pinecone.index(process.env['PINECONE_INDEX'] as string);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddingLLM, {
        pineconeIndex: pineconeIndexDataOperation as any,
    });

    return vectorStore.asRetriever();
}
