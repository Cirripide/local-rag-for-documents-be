import Indexer from "./services/indexer/indexer";

const indexer = new Indexer();

await indexer.index();
