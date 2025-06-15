import {
    GetConversationsParams,
    CreateConversationParams,
} from "../daos/conversation-dao.model";

declare module 'express-serve-static-core' {
    interface Request {
        validatedGetConversationsParams?: GetConversationsParams,
        validatedCreateConversationParams?: CreateConversationParams
    }
}
