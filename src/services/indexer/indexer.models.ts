import {Embeddings} from "@langchain/core/embeddings";
import {Document} from "@langchain/core/documents";

export type VectorDbServiceAdapter = {
    createCollection: () => Promise<boolean>;
    deleteCollection: () => Promise<boolean>;
    checkCollectionExists: () => Promise<boolean>;
    vectorizeChunks: (config: { embeddingLLM: Embeddings, docs: Document[], baseIndexId?: number }) => Promise<void>;
}
