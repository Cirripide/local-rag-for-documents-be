import {Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();

export const getAssistantName = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = {assistantName: process.env['ASSISTANT_NAME']}
        res.json(response);
    } catch (e) {
        res.status(500).send("Unknown error");
    }
};
