import {Request} from "express";
import type { WebSocket } from 'ws';
import {MessageDao} from "../daos/message-dao";
import RagService from "../services/rag";
import {Message} from "../models/message.model";
import {ConversationDao} from "../daos/conversation-dao";

export const chatWithAi = async (ws: WebSocket, req: Request) => {

    ws.on('message', async (msg: any) => {
        try {
            const ragService = new RagService();
            const conversationId = +req.params.conversationId;
            const answer = msg.toString();

            const messageDao = new MessageDao();
            const conversationDao = new ConversationDao();

            const rawMessageHistory: Message[] = await messageDao.getMessages({conversationId, sort: 'asc'});

            await messageDao.createMessage({
                from: "Human",
                message: answer,
                conversationId
            });

            const ragRes = await ragService.answer(answer, rawMessageHistory);

            await messageDao.createMessage({
                from: "Ai",
                message: ragRes,
                conversationId: conversationId
            });

            await conversationDao.updateConversation({
                id: conversationId,
                lastUpdate: new Date()
            });

            ws.send(ragRes);
        } catch(e) {
            ws.send("Unknown error");
        }
    });
}
