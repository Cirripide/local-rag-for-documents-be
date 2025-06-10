import prisma from '../services/prisma/prisma-client';
import {Conversation} from "../models/conversation.model";

export class ConversationDao {

    constructor() {
    }

    async getAllConversations() {
        const conversations = await prisma.conversation.findMany();

        return conversations;
    }


    async createConversation(config: Omit<Conversation, "id" | "createdAt">) {
        const conversation = await prisma.conversation.create({
            data: {
                title: config.title
            }
        });

        return conversation;
    }



}
