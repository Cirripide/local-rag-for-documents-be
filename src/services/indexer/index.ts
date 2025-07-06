import Indexer from "./indexer";
import ChromaService from "../chroma/chroma-service";

const chromaService = new ChromaService();
export const indexer = new Indexer(chromaService);
