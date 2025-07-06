import {Request, Response} from "express";
import {indexer} from "../services/indexer";

export const ragIndexingController = async (req: Request, res: Response): Promise<void> => {
    try {
        indexer.index();
        res.status(202).json({status: "started"});
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};
