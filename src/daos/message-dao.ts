import prisma from '../services/prisma/prisma-client';
import {CreateMessageParams, GetMessagesParams, MessagesQueryParamsSort} from "./message-dao.model";
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

    async getMessages(params: GetMessagesParams): Promise<Message[]> {
        const sort: MessagesQueryParamsSort = params.sort || "desc";
        const conversationId: number = params.conversationId;

        const orderBy = {
            createdAt: sort
        }

        const messages = await prisma.message.findMany({
            where: {
              conversationId
            },
            orderBy
        });

        return messages;
    }
}
