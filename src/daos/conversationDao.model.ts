export const CreateConversationQueryParamsOrderByValues = ["createdAt", "lastUpdate"] as const;
export const CreateConversationQueryParamsSortValues = ["asc", "desc"] as const;

export type CreateConversationQueryParamsOrderBy = typeof CreateConversationQueryParamsOrderByValues[number];
export type CreateConversationQueryParamsSort = typeof CreateConversationQueryParamsSortValues[number];

// type-guard CreateConversationQueryParamsOrderBy
export function isCreateConversationQueryParamsOrderBy(value: any): value is CreateConversationQueryParamsOrderBy {
    if (typeof value !== "string") {
        return false;
    }
    return (CreateConversationQueryParamsOrderByValues as readonly string[]).includes(value);
}

// type-guard CreateConversationQueryParamsSort
export function isCreateConversationQueryParamsSort(value: any): value is CreateConversationQueryParamsSort {
    if (typeof value !== "string") {
        return false;
    }
    return (CreateConversationQueryParamsSortValues as readonly string[]).includes(value);
}

export type CreateConversationQueryParams = {
    orderBy?: CreateConversationQueryParamsOrderBy;
    sort?: CreateConversationQueryParamsSort;
}
