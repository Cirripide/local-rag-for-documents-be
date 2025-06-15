import {Request, Response} from 'express';
import {ConversationDao} from "../daos/conversation-dao";

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
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Unknown error");
        }
    }
};

/*export const updateConversation = async (req: Request, res: Response): Promise<void> => {

};*/

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
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Unknown error");
        }
    }
};
