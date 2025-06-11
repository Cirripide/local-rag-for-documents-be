import express from "express";
import {createConversation, getAllConversations} from "../../controllers/conversationsController";

const router = express.Router();

/**
 * @openapi
 * /api/v1/conversations:
 *     get:
 *         summary: Get all conversations
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/GetConversationsResponse'
 *             500:
 *                 description: Server Error
 */
router.get('/', getAllConversations);

/**
 * @openapi
 * /api/v1/conversations:
 *     post:
 *         summary: Create a new conversation
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         $ref: '#/components/schemas/NewConversationInput'
 *         responses:
 *             200:
 *                 description: Conversation created successfully
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/Conversation'
 *             500:
 *                 description: Server Error
 */
router.post('/', createConversation);

export default router;
