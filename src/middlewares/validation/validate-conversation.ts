import {Request, Response, NextFunction} from 'express';
import {ErrorParam, invalidParamsErrorResponse} from "../../services/errors/response-error-handlers";
import {
    CreateConversationQueryParamsOrderByValues, CreateConversationQueryParamsSortValues, GetConversationsParams,
    isCreateConversationQueryParamsOrderBy, isCreateConversationQueryParamsSort
} from "../../daos/conversation-dao.model";

export const validateConversationRequiredFields = (req: Request, res: Response, next: NextFunction) => {
    const errorParams: ErrorParam[] = [];

    if (typeof req.body?.title !== "string") {
        errorParams.push({
            name: "title",
            description: `${req.body?.title === undefined ? "Required field" : "Invalid value format"}`,
            unrecognizedValue: req.body?.title,
            allowedValues: "string type"
        });
    }

    if (errorParams.length) {
        invalidParamsErrorResponse(res, errorParams);
        return;
    }

    req["validatedCreateConversationParams"] = {title: req.body.title};

    next();
};

export const validateGetAllConversationsFields = (req: Request, res: Response, next: NextFunction) => {

    const errorParams: ErrorParam[] = [];
    const validatedParams: GetConversationsParams = {};

    if (req.query?.order_by !== undefined && !isCreateConversationQueryParamsOrderBy(req.query?.order_by)) {
        errorParams.push({
            name: "order_by",
            description: "Invalid value format",
            unrecognizedValue: req.query?.order_by,
            allowedValues: CreateConversationQueryParamsOrderByValues
        });
    } else {
        validatedParams["orderBy"] = req.query?.order_by;
    }

    if (req.query?.sort !== undefined && !isCreateConversationQueryParamsSort(req.query?.sort)) {
        errorParams.push({
            name: "sort",
            description: "Invalid value format",
            unrecognizedValue: req.query?.sort,
            allowedValues: CreateConversationQueryParamsSortValues
        });
    } else {
        validatedParams["sort"] = req.query?.sort
    }

    if (errorParams.length) {
        invalidParamsErrorResponse(res, errorParams);
        return;
    }

    req["validatedGetConversationsParams"] = validatedParams;
    next();
};
