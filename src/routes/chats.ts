import express from "express";
import {getChats} from "../controllers/chatsController";

const router = express.Router();

router.get('/', getChats);

export default router;
