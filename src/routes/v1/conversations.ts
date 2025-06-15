import express from "express";
import {createConversation, getAllConversations} from "../../controllers/conversations-controller";
import {
    validateConversationRequiredFields,
    validateGetAllConversationsFields
} from "../../middlewares/validation/validate-conversation";

const router = express.Router();

/**
 * @openapi
 * /api/v1/conversations:
 *     get:
 *         summary: Get all conversations
 *         parameters:
 *             - in: query
 *               name: order_by
 *               required: false
 *               schema:
 *                   type: string
 *                   enum:
 *                       - createdAt
 *                       - lastUpdate
 *               description: Field by which to sort the conversations
 *             - in: query
 *               name: sort
 *               required: false
 *               schema:
 *                   type: string
 *                   enum:
 *                       - asc
 *                       - desc
 *               description: Sort direction (ascending or descending)
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/GetConversationsResponse'
 *             400:
 *                 description: Bad Request – invalid query parameters
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/InvalidParams'
 *             500:
 *                 description: Server Error
 */
router.get('/', validateGetAllConversationsFields, getAllConversations);

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
 *             400:
 *                 description: Bad Request – invalid query parameters
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/InvalidParams'
 *             500:
 *                 description: Server Error
 */
router.post('/', validateConversationRequiredFields, createConversation);

//router.patch('/');

export default router;
