import {Message} from "../models/message.model";

export type CreateMessageParams = Omit<Message, "id" | "createdAt">;
