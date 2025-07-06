import {Request, Response} from "express";
import {indexer} from "../services/indexer";
import type {WebSocket} from "ws";
import {WebSocketIndexingAdapter} from "./adapters/indexing";

export const ragIndexingController = async (req: Request, res: Response): Promise<void> => {
    try {
        indexer.index();
        res.status(202).json({status: "started"});
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};

export const indexingStatusController = async (ws: WebSocket, req: Request) => {
    try {
        const webSocketAdapter = new WebSocketIndexingAdapter(ws);

        indexer.registerStatusObserver(webSocketAdapter);

        ws.on('close', () => {
            indexer.unregisterStatusObserver(webSocketAdapter);
        });
    } catch (e) {
        ws.send("Unknown error");
    }
}
