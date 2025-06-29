import {Request} from "express";
import type { WebSocket } from 'ws';
import {MessageDao} from "../daos/message-dao";
import RagService from "../services/rag";

export const chatWithAi = async (ws: WebSocket, req: Request) => {

    ws.on('message', async (msg: any) => {
        try {
            const ragService = new RagService();
            const conversationId = +req.params.conversationId;
            const answer = msg.toString();

            const messageDao = new MessageDao();

            await messageDao.createMessage({
                from: "Human",
                message: answer,
                conversationId
            });

            const ragRes = await ragService.answer(answer);

            await messageDao.createMessage({
                from: "Ai",
                message: ragRes,
                conversationId: conversationId
            });

            ws.send(ragRes);
        } catch(e) {
            ws.send("Unknown error");
        }
    });
}
