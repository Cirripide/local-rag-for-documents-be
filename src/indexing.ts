import Indexer from "./services/indexer/indexer";
import ChromaService from "./services/chroma/chroma-service";

const chromaService = new ChromaService();
const indexer = new Indexer(chromaService);

await indexer.index();
