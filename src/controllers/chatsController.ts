import { Request, Response, NextFunction } from 'express';

export const getChats = (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.json({
            id: 4,
            title: "Chat title"
        });
    } catch(e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        } else {
            res.status(500).send("Errore sconosciuto");
        }
    }
};
