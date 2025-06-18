import {NextFunction, Request, Response} from 'express';
import {ErrorParam, invalidParamsErrorResponse} from "../../services/errors/response-error-handlers";
import {
    CreateConversationQueryParamsOrderByValues,
    CreateConversationQueryParamsSortValues,
    GetConversationsParams,
    isCreateConversationQueryParamsOrderBy,
    isCreateConversationQueryParamsSort, UpdateConversationParams
} from "../../daos/conversation-dao.model";
import {isISO8601} from "../../models/common";

export const validateConversationRequiredFields = (req: Request<{}, {}, {[key: string]: unknown}>, res: Response, next: NextFunction) => {
    const errorParams: ErrorParam[] = [];
    let title: string | undefined;

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

    if (!title) {
        res.status(500).send("Unknown error");
        return;
    }

    req["validatedCreateConversationParams"] = {title};

    next();
};

export const validateGetAllConversationsFields = (req: Request<{}, {}, {[key: string]: unknown}>, res: Response, next: NextFunction) => {

    const errorParams: ErrorParam[] = [];
    const validatedParams: GetConversationsParams = {};

    if (req.query?.order_by !== undefined && !isCreateConversationQueryParamsOrderBy(req.query?.order_by)) {
        errorParams.push({
            name: "order_by",
            description: "Invalid query value format",
            unrecognizedValue: req.query?.order_by,
            allowedValues: CreateConversationQueryParamsOrderByValues
        });
    } else {
        validatedParams["orderBy"] = req.query?.order_by;
    }

    if (req.query?.sort !== undefined && !isCreateConversationQueryParamsSort(req.query?.sort)) {
        errorParams.push({
            name: "sort",
            description: "Invalid query value format",
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

export const validateUpdateConversationFields = (req: Request<{id: string}, {}, {[key: string]: unknown}>, res: Response, next: NextFunction) => {

    const errorParams: ErrorParam[] = [];
    const optionalValidatedParams: Partial<UpdateConversationParams> = {};
    let id: number | undefined;

    if (!req.params.id) {
        errorParams.push({
            name: "id",
            description: "Invalid query param",
            unrecognizedValue: req.params.id,
            allowedValues: "Number"
        });
    } else {
        id  = +req.params.id;
    }

    if (req.body?.title !== undefined && typeof req.body?.title !== "string") {
        errorParams.push({
            name: "title",
            description: "Invalid value format",
            unrecognizedValue: req.body?.title,
            allowedValues: "string type"
        });
    } else {
        optionalValidatedParams["title"] = req.body?.title;
    }

    if (req.body?.lastUpdate !== undefined &&  !isISO8601(req.body?.lastUpdate)) {
        errorParams.push({
            name: "lastUpdate",
            description: "Invalid value format",
            unrecognizedValue: req.body?.title,
            allowedValues: "Date in ISO 8601 format"
        });
    } else {
        optionalValidatedParams["lastUpdate"] = req.body?.lastUpdate ? new Date(req.body?.lastUpdate) : undefined;
    }

    if (errorParams.length) {
        invalidParamsErrorResponse(res, errorParams);
        return;
    }

    if (!id) {
        res.status(500).send("Unknown error");
        return;
    }

    req["validatedUpdateConversationParams"] = {id, ...optionalValidatedParams};
    next();
};
