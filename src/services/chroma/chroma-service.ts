import dotenv from "dotenv";
import {Chroma} from "@langchain/community/vectorstores/chroma";
import {Embeddings} from "@langchain/core/embeddings";
import {ChromaClient, Collection} from "chromadb";
import {Document} from "@langchain/core/documents";

dotenv.config();

export default class ChromaService {
    private readonly collectionName: string;
    private readonly dbUrl: string;
    private readonly client: ChromaClient;

    constructor() {
        this.collectionName = process.env["CHROMA_COLLECTION_NAME"] || "chunks";
        this.dbUrl = process.env["CHROMA_URL"] || "http://localhost:8000";
        this.client = new ChromaClient();

    }

    async createCollection(): Promise<Collection> {
        const collection = await this.client.createCollection({
            name: this.collectionName,

        });

        return collection;
    }

    async deleteCollection(): Promise<void> {
        await this.client.deleteCollection({name: this.collectionName});
    }

    async getCollection(): Promise<Collection> {
        const collection = await this.client.getCollection({name: this.collectionName});
        return collection;
    }

    getVectorStore(embeddingLLM: Embeddings): Chroma {
        return new Chroma(embeddingLLM, {
            collectionName: this.collectionName,
            url: this.dbUrl
        });
    }

    async vectorizeChunks(config: {embeddingLLM: Embeddings, docs: Document[], baseIndexId?: number}) {
        const vectorStore = this.getVectorStore(config.embeddingLLM);

        const cleanDocs = config.docs.map(doc => {
            const { pdf, ...restMetadata } = doc.metadata;
            return {
                ...doc,
                metadata: restMetadata,
            };
        });

        const baseIndex = config.baseIndexId || 0;
        const batchIds = cleanDocs.map((chunk, index) => (baseIndex + index).toString());

        await vectorStore.addDocuments(cleanDocs, { ids: batchIds });
    }


}
