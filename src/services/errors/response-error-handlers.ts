import {Response} from "express";

export type ErrorParam = {
    name: string;
    UnrecognizedValue: any;
    allowedValues: readonly any[];
}

export type InvalidParams = {
    title: "Invalid Parameters";
    status: 400;
    detail: "One or more parameters are in an incorrect format."
    invalidParams: ErrorParam[];
}

export function invalidParamsErrorResponse(res: Response, errors: ErrorParam[]): void {
    res.status(400).json({
        "title": "Invalid Parameters",
        "status": 400,
        "detail": "One or more parameters are in an incorrect format.",
        "invalidParams": errors
    });
}
