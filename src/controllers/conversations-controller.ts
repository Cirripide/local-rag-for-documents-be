import {Request, Response} from 'express';
import {ConversationDao} from "../daos/conversation-dao";
import {MessageDao} from "../daos/message-dao";

export const createConversation = async (req: Request, res: Response): Promise<void> => {
    if (!req.validatedCreateConversationParams) {
        throw new Error("createConversation was used without first using the validator");
    }

    try {
        const title = req.validatedCreateConversationParams.title;
        const conversationDao = new ConversationDao();
        const conversation = await conversationDao.createConversation({title});
        res.json(conversation);
    } catch (e) {
        console.log("Qui erroreeeeee")
        console.dir(e);
        res.status(500).send("Unknown error");
    }
};

export const updateConversation = async (req: Request, res: Response): Promise<void> => {
    if (!req.validatedUpdateConversationParams) {
        throw new Error("updateConversation was used without first using the validator");
    }

    try {
        const id = req.validatedUpdateConversationParams.id;
        const title = req.validatedUpdateConversationParams.title;
        const lastUpdate = req.validatedUpdateConversationParams.lastUpdate;
        const conversationDao = new ConversationDao();
        const conversation = await conversationDao.updateConversation({
            id,
            title,
            lastUpdate
        });
        res.json(conversation);
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};

export const deleteConversation = async (req: Request, res: Response): Promise<void> => {
    if (!req.validatedDeleteConversationParams) {
        throw new Error("deleteConversation was used without first using the validator");
    }

    try {
        const id = req.validatedDeleteConversationParams.id;

        const conversationDao = new ConversationDao();
        const conversation = await conversationDao.deleteConversation({
            id
        });
        res.json(conversation);
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};

export const getAllConversations = async (req: Request, res: Response): Promise<void> => {
    if (!req.validatedGetConversationsParams) {
        throw new Error("getAllConversations was used without first using the validator");
    }

    try {
        const orderBy = req.validatedGetConversationsParams.orderBy;
        const sort = req.validatedGetConversationsParams.sort;

        const conversationDao = new ConversationDao();

        const conversations = await conversationDao.getAllConversations({
            orderBy,
            sort
        });

        const prepareRes = {
            hits: conversations
        }

        res.json(prepareRes);
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};

export const getConversationMessages = async (req: Request, res: Response): Promise<void> => {
    if (!req.validateGetConversationMessages) {
        throw new Error("getConversationMessages was used without first using the validator");
    }

    try {
        const conversationId = req.validateGetConversationMessages.conversationId;
        const sort = req.validateGetConversationMessages.sort;

        const messageDao = new MessageDao();

        const messages = await messageDao.getMessages({
            conversationId,
            sort
        });

        const prepareRes = {
            hits: messages
        }

        res.json(prepareRes);
    } catch (e) {
        res.status(500).send("Unknown error");
    }
}
