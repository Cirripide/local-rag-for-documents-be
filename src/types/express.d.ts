import {
    GetConversationsParams,
    CreateConversationParams, UpdateConversationParams, DeleteConversationParams,
} from "../daos/conversation-dao.model";


declare module 'express-serve-static-core' {
    interface Request {
        validatedGetConversationsParams?: GetConversationsParams,
        validatedCreateConversationParams?: CreateConversationParams
        validatedUpdateConversationParams?: UpdateConversationParams
        validatedDeleteConversationParams?: DeleteConversationParams
    }
}
