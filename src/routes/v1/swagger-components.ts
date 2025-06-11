/**
 * @openapi
 * components:
 *     schemas:
 *         Conversation:
 *             type: object
 *             required:
 *                 - id
 *                 - title
 *                 - createdAt
 *                 - lastUpdate
 *             properties:
 *                 id:
 *                     type: integer
 *                     example: 1
 *                 title:
 *                     type: string
 *                     example: "Progetto Alpha"
 *                 createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-01T12:00:00Z"
 *                 lastUpdate:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-05T09:30:00Z"
 *
 *         GetConversationsResponse:
 *             type: object
 *             required:
 *                 - hits
 *             properties:
 *                 hits:
 *                     type: array
 *                     items:
 *                         $ref: '#/components/schemas/Conversation'
 *
 *         NewConversationInput:
 *             type: object
 *             required:
 *                 - title
 *             properties:
 *                 title:
 *                     type: string
 *                     example: "New conversation"
 */
