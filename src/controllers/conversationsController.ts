import {Request, Response} from 'express';
import {ConversationDao} from "../daos/conversationDao";
import {
    CreateConversationQueryParamsOrderByValues, CreateConversationQueryParamsSortValues,
    isCreateConversationQueryParamsOrderBy,
    isCreateConversationQueryParamsSort
} from "../daos/conversationDao.model";
import {ErrorParam, invalidParamsErrorResponse} from "../services/errors/response-error-handlers";

export const createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        const errorParams: ErrorParam[] = [];
        let title;

        if (typeof req.body?.title !== "string") {
            errorParams.push({
                name: "title",
                description: `${req.body?.title === undefined ? "Required field" : "Invalid value format"}`,
                unrecognizedValue: req.body?.title,
                allowedValues: "string type"
            });
        } else {
            title = req.body.title;
        }

        if (errorParams.length) {
            invalidParamsErrorResponse(res, errorParams);
            return;
        }

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

export const getAllConversations = async (req: Request, res: Response): Promise<void> => {
    try {
        const errorParams: ErrorParam[] = [];

        let orderBy;
        let sort;

        if (req.query?.order_by !== undefined && !isCreateConversationQueryParamsOrderBy(req.query?.order_by)) {
            errorParams.push({
                name: "order_by",
                description: "Invalid value format",
                unrecognizedValue: req.query?.order_by,
                allowedValues: CreateConversationQueryParamsOrderByValues
            });
        } else {
            orderBy = req.query?.order_by;
        }

        if (req.query?.sort !== undefined && !isCreateConversationQueryParamsSort(req.query?.sort)) {
            errorParams.push({
                name: "sort",
                description: "Invalid value format",
                unrecognizedValue: req.query?.sort,
                allowedValues: CreateConversationQueryParamsSortValues
            });
        } else {
            sort = req.query?.sort;
        }

        if (errorParams.length) {
            invalidParamsErrorResponse(res, errorParams);
            return;
        }

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
