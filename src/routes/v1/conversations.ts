import express from "express";
import {createConversation, getAllConversations} from "../../controllers/conversationsController";

const router = express.Router();

router.get('/', getAllConversations);

router.post('/', createConversation);

export default router;
