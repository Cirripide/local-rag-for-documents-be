import express from "express";
import {
    createConversation,
    deleteConversation,
    getAllConversations, getConversationMessages,
    updateConversation
} from "../../controllers/conversations-controller";
import {
    validateConversationRequiredFields, validateDeleteConversationFields,
    validateGetAllConversationsFields, validateGetConversationMessages, validateUpdateConversationFields
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

/**
 * @openapi
 * /api/v1/conversations/{id}:
 *     patch:
 *         summary: Update a conversation
 *         parameters:
 *             - in: path
 *               name: id
 *               required: true
 *               schema:
 *                   type: integer
 *               description: ID of the conversation to update
 *         requestBody:
 *             required: true
 *             content:
 *                 application/json:
 *                     schema:
 *                         type: object
 *                         properties:
 *                             title:
 *                                 type: string
 *                                 example: "Update title"
 *                             lastUpdate:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2024-06-10T15:45:00Z"
 *         responses:
 *             200:
 *                 description: Conversation updated successfully
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
router.patch('/:id', validateUpdateConversationFields, updateConversation);

/**
 * @openapi
 * /api/v1/conversations/{id}:
 *     delete:
 *         summary: Delete a conversation
 *         parameters:
 *             - in: path
 *               name: id
 *               required: true
 *               schema:
 *                   type: integer
 *               description: ID of the conversation to delete
 *         responses:
 *             200:
 *                 description: Conversation deleted successfully
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
router.delete('/:id', validateDeleteConversationFields, deleteConversation);

/**
 * @openapi
 * /api/v1/conversations/{id}/messages:
 *     get:
 *         summary: Get all messages for a specific conversation
 *         parameters:
 *             - in: path
 *               name: id
 *               required: true
 *               schema:
 *                   type: integer
 *               description: ID of the conversation
 *             - in: query
 *               name: sort
 *               required: false
 *               schema:
 *                   type: string
 *                   enum:
 *                     - asc
 *                     - desc
 *               description: Sort direction for the messages (ascending or descending)
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/GetConversationMessagesResponse'
 *             400:
 *                 description: Bad Request – invalid query parameters
 *                 content:
 *                     application/json:
 *                         schema:
 *                             $ref: '#/components/schemas/InvalidParams'
 *             500:
 *                 description: Server Error
 */
router.get('/:id/messages', validateGetConversationMessages, getConversationMessages);

export default router;
