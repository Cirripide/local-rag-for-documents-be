type MessageFrom = "Human" | "Ai";

export type Message = {
    id: number;
    from: MessageFrom;
    message: string;
    conversationId: number;
    createdAt: Date;
}
