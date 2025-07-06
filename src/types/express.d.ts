import {
    GetConversationsParams,
    CreateConversationParams, UpdateConversationParams, DeleteConversationParams,
} from "../daos/conversation-dao.model";
import {GetMessagesParams} from "../daos/message-dao.model";


declare module 'express-serve-static-core' {
    interface Request {
        validatedGetConversationsParams?: GetConversationsParams;
        validatedCreateConversationParams?: CreateConversationParams;
        validatedUpdateConversationParams?: UpdateConversationParams;
        validatedDeleteConversationParams?: DeleteConversationParams;
        validateGetConversationMessages?: GetMessagesParams;
    }
}
