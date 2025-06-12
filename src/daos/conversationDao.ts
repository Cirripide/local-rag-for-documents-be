import prisma from '../services/prisma/prisma-client';
import {Conversation} from "../models/conversation.model";
import {
    CreateConversationQueryParams,
    CreateConversationQueryParamsOrderBy,
    CreateConversationQueryParamsSort
} from "./conversationDao.model";

export class ConversationDao {

    constructor() {
    }

    async getAllConversations(queryParams?: CreateConversationQueryParams): Promise<Conversation[]> {
        const orderByKey: CreateConversationQueryParamsOrderBy = queryParams?.orderBy || "lastUpdate";
        const sort: CreateConversationQueryParamsSort = queryParams?.sort || "desc";

        const orderBy = {
            [orderByKey]: sort
        }

        const conversations = await prisma.conversation.findMany({
            orderBy
        });

        return conversations;
    }


    async createConversation(config: Omit<Conversation, "id" | "createdAt" | "lastUpdate">): Promise<Conversation> {
        const conversation = await prisma.conversation.create({
            data: {
                title: config.title
            }
        });

        return conversation;
    }

}
