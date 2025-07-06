import {WebSocket} from "ws";
import {IndexingStatus, IndexingStatusObserverAdapter} from "../../services/indexer/indexer.models";

export class WebSocketIndexingAdapter implements IndexingStatusObserverAdapter {
    constructor(private ws: WebSocket) {
    }

    notifyStatus(status: IndexingStatus) {
        this.ws.send(JSON.stringify(status));
    }
}
