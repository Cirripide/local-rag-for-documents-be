import express from "express";
import dotenv from "dotenv";
import chatsRoutes from "./routes/chats";

dotenv.config();

const app = express();

app.use('/chats', chatsRoutes);

app.listen(process.env["EXPRESS_PORT"]);
