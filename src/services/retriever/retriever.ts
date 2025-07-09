import {VectorStoreRetriever} from "@langchain/core/vectorstores";
import {OllamaEmbeddings} from "@langchain/ollama";
import ChromaService from "../chroma/chroma-service";

import dotenv from "dotenv";

dotenv.config();

export async function createRetriever(): Promise<VectorStoreRetriever> {

    const embeddingLLM = new OllamaEmbeddings({
        model: process.env['EMBEDDINGS_LLM_MODEL'] || 'nomic-embed-text',
        baseUrl: 'host.docker.internal'
    });

    const chromaService = new ChromaService();

    const vectorStore = await chromaService.getVectorStore(embeddingLLM);

    return vectorStore.asRetriever({
        k: 8
    });
}
