import {Message} from "../models/message.model";

export const MessagesQueryParamsSortValues = ["asc", "desc"] as const;

export type MessagesQueryParamsSort = typeof MessagesQueryParamsSortValues[number];

// type-guard ConversationsQueryParamsSort
export function isMessagesQueryParamsSort(value: any): value is MessagesQueryParamsSort {
    if (typeof value !== "string") {
        return false;
    }
    return (MessagesQueryParamsSortValues as readonly string[]).includes(value);
}

export type GetMessagesParams = {
    conversationId: number;
    sort?: MessagesQueryParamsSort;
}

export type CreateMessageParams = Omit<Message, "id" | "createdAt">;
