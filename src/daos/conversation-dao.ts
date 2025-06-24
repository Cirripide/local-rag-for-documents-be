import prisma from '../services/prisma/prisma-client';
import {Conversation} from "../models/conversation.model";
import {
    GetConversationsParams,
    CreateConversationQueryParamsOrderBy,
    CreateConversationQueryParamsSort,
    CreateConversationParams, UpdateConversationParams, DeleteConversationParams
} from "./conversation-dao.model";
import {Prisma} from "../prisma/generated";


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
        try {
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
        } catch (err) {

            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                throw new Error(`Conversation with id=${params.id} not found`);
            }
            throw new Error("Unknown Error");
        }

    }

    async deleteConversation(params: DeleteConversationParams): Promise<Conversation> {
        try {
            const id = params.id;

            const conversation = await prisma.conversation.delete(
                {
                    where: {
                        id
                    }
                }
            );

            return conversation;
        } catch (err) {

            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
                throw new Error(`Conversation with id=${params.id} not found`);
            }
            throw new Error("Unknown Error");
        }

    }

}
