import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import {SingleBar} from "cli-progress";
import {DocxLoader} from "@langchain/community/document_loaders/fs/docx";
import {Document} from "@langchain/core/documents";
import {TextLoader} from "langchain/document_loaders/fs/text";
import {PDFLoader} from "@langchain/community/document_loaders/fs/pdf";
import {DocumentLoader} from "@langchain/core/document_loaders/base";
import {RecursiveCharacterTextSplitter} from "langchain/text_splitter";
import {OllamaEmbeddings} from "@langchain/ollama";
import {VectorDbServiceAdapter} from "./indexer.models";


export default class Indexer {

    filesExtensions: string[] = ['.docx', '.txt', '.pdf'];
    vectorDbService: VectorDbServiceAdapter;

    constructor(vectorDbService: VectorDbServiceAdapter) {
        dotenv.config();
        this.vectorDbService = vectorDbService;
    }

    public async crawlDocsPaths(): Promise<string[]> {

        const docs: string[] = [];

        console.log("Crawling Documents...");

        const progressBar = new SingleBar({
            format: "Documents Crawled: {value}",
        });

        progressBar.start(1000, 0);

        // if (!process.env['FOLDER_PATH']) {
        //    console.error("No folder path found");
        //    progressBar.stop();
        // }

        await this.recursiveDocFind({
            directory: `${process.cwd()}/documents`,
            foundDocumentsPath: docs,
            progressBar
        });

        progressBar.stop();
        return docs;
    }

    public async loadDocuments(documentsPaths: string[]): Promise<Document[]> {

        const progressBar = new SingleBar({});

        console.log(`Starting document download. ${documentsPaths.length} total documents`);

        progressBar.start(documentsPaths.length, 0);

        const rawDocuments: Document[] = [];

        let loadErrors = [];

        for (const documentPath of documentsPaths) {
            try {
                const docs = await this.loadDocument(documentPath);
                rawDocuments.push(...docs);
            } catch (error) {
                loadErrors.push(documentPath);
            }
            progressBar.increment();
        }

        progressBar.stop();

        if (loadErrors.length) {
            console.log(`Some documents may not have been loaded. Check for blank or corrupted documents. Paths: \n${loadErrors.join('\n')}`);
        }

        return rawDocuments;
    }

    public async chunkDocuments(rawDocuments: Document[]): Promise<Document[]> {
        console.log('splitting documents...');

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 100
        });

        const documentChunks = await splitter.splitDocuments(rawDocuments);

        console.log(`${rawDocuments.length} documents split into ${documentChunks.length} chunks`);

        return documentChunks;
    }

    public async vectorizeChunks(chunks: Document[]) {

        const embeddingLLM = new OllamaEmbeddings({
            model: process.env['EMBEDDINGS_LLM_MODEL'] || 'nomic-embed-text'
        });

        if (await this.vectorDbService.checkCollectionExists()) {
            await this.vectorDbService.deleteCollection();
        }

        await this.vectorDbService.createCollection();

        console.log('Starting Vectorization...');
        const progressBar = new SingleBar({});
        progressBar.start(chunks.length, 0);

        for (let i = 0; i < chunks.length; i = i + 100) {
            const batch = chunks.slice(i, i + 100);

            await this.vectorDbService.vectorizeChunks({embeddingLLM, docs: batch, baseIndexId: i});

            progressBar.increment(batch.length);
        }

        progressBar.stop();
        console.log('Vectorization completed and chunked stored in the vector db.');
    }

    public async index() {
        const docsPaths = await this.crawlDocsPaths();

        const docs = await this.loadDocuments(docsPaths);

        const chunks = await this.chunkDocuments(docs);

        await this.vectorizeChunks(chunks);
    }

    private async recursiveDocFind(config: {
        directory: string,
        foundDocumentsPath: string[],
        progressBar: SingleBar
    }): Promise<void> {
        const elements = await fs.readdir(config.directory);

        for (const element of elements) {
            const fullPath = path.join(config.directory, element);
            const state = await fs.stat(fullPath);

            if (state.isDirectory()) {
                await this.recursiveDocFind({
                    directory: fullPath,
                    foundDocumentsPath: config.foundDocumentsPath,
                    progressBar: config.progressBar,
                });
            } else if (this.filesExtensions.includes(path.extname(fullPath))) {
                config.progressBar.increment(1);
                config.foundDocumentsPath.push(fullPath);
            }
        }
    }

    private async loadDocument(documentPath: string): Promise<Document[]> {

        const fileType = path.extname(documentPath);

        let loader: DocumentLoader;

        switch (fileType) {
            case '.docx':
                loader = new DocxLoader(documentPath);
                break;
            case '.txt':
                loader = new TextLoader(documentPath);
                break;
            case '.pdf':
                loader = new PDFLoader(documentPath);
                break;
            default:
                loader = new DocxLoader(documentPath);
        }

        return await loader.load();
    }
}
