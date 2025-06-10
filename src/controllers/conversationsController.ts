import {Request, Response} from 'express';
import {ConversationDao} from "../daos/conversationDao";

export const createConversation = (req: Request, res: Response): void => {
    try {
        const {title} = req.body;
        const conversationDao = new ConversationDao();
        const conversation = conversationDao.createConversation({title});
        res.json(conversation);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
};

export const getAllConversations = (req: Request, res: Response): void => {
    try {
        const conversationDao = new ConversationDao();
        const conversations = conversationDao.getAllConversations();
        res.json(conversations);
    } catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
};
