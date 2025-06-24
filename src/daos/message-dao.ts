import prisma from '../services/prisma/prisma-client';
import {CreateMessageParams} from "./message-dao.model";
import {Message} from "../models/message.model";

export class MessageDao {

    constructor() {
    }

    async createMessage(params: CreateMessageParams): Promise<Message> {
        const message = await prisma.message.create({
            data: {
                from: params.from,
                message: params.message,
                conversationId: params.conversationId,
            }
        });

        return message;
    }
}
