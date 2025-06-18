import prisma from '../services/prisma/prisma-client';
import {Conversation} from "../models/conversation.model";
import {
    GetConversationsParams,
    CreateConversationQueryParamsOrderBy,
    CreateConversationQueryParamsSort,
    CreateConversationParams, UpdateConversationParams
} from "./conversation-dao.model";

export class ConversationDao {

    constructor() {
    }

    async getAllConversations(params?: GetConversationsParams): Promise<Conversation[]> {
        const orderByKey: CreateConversationQueryParamsOrderBy = params?.orderBy || "lastUpdate";
        const sort: CreateConversationQueryParamsSort = params?.sort || "desc";

        const orderBy = {
            [orderByKey]: sort
        }

        const conversations = await prisma.conversation.findMany({
            orderBy
        });

        return conversations;
    }


    async createConversation(params: CreateConversationParams): Promise<Conversation> {
        const conversation = await prisma.conversation.create({
            data: {
                title: params.title
            }
        });

        return conversation;
    }

    async updateConversation(params: UpdateConversationParams): Promise<Conversation> {
        const title = params.title;
        const lastUpdate = params.lastUpdate;

        const conversation = await prisma.conversation.update(
            {
                where: {
                    id: params.id
                },
                data: {
                    title,
                    lastUpdate
                }
            }
        );

        return conversation;
    }

}
