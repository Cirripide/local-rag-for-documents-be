import {Conversation} from "../models/conversation.model";

export const ConversationsQueryParamsOrderByValues = ["createdAt", "lastUpdate"] as const;
export const ConversationsQueryParamsSortValues = ["asc", "desc"] as const;

export type ConversationsQueryParamsOrderBy = typeof ConversationsQueryParamsOrderByValues[number];
export type ConversationsQueryParamsSort = typeof ConversationsQueryParamsSortValues[number];

// type-guard ConversationsQueryParamsOrderBy
export function isConversationsQueryParamsOrderBy(value: any): value is ConversationsQueryParamsOrderBy {
    if (typeof value !== "string") {
        return false;
    }
    return (ConversationsQueryParamsOrderByValues as readonly string[]).includes(value);
}

// type-guard ConversationsQueryParamsSort
export function isConversationsQueryParamsSort(value: any): value is ConversationsQueryParamsSort {
    if (typeof value !== "string") {
        return false;
    }
    return (ConversationsQueryParamsSortValues as readonly string[]).includes(value);
}

export type GetConversationsParams = {
    orderBy?: ConversationsQueryParamsOrderBy;
    sort?: ConversationsQueryParamsSort;
}

export type CreateConversationParams = Omit<Conversation, "id" | "createdAt" | "lastUpdate">;

export type UpdateConversationParams = Required<Pick<Conversation, "id">> & Partial<Pick<Conversation, "title" | "lastUpdate">>;

export type DeleteConversationParams = Pick<Conversation, "id">;
