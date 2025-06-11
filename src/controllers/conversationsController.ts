import {Request, Response} from 'express';
import {ConversationDao} from "../daos/conversationDao";

export const createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const {title} = req.body;
        const conversationDao = new ConversationDao();
        const conversation = await conversationDao.createConversation({title});
        res.json(conversation);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
};

export const getAllConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const conversationDao = new ConversationDao();
        const conversations = await conversationDao.getAllConversations();
        const prepareRes = {
            hits: conversations
        }
        res.json(prepareRes);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
};
