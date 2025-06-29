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
 *                     example: "Alpha conversation"
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
 *
 *         Message:
 *             type: object
 *             required:
 *                 - id
 *                 - from
 *                 - message
 *                 - conversationId
 *                 - createdAt
 *             properties:
 *                 id:
 *                     type: integer
 *                     example: 42
 *                 from:
 *                     $ref: '#/components/schemas/MessageFrom'
 *                 message:
 *                     type: string
 *                     example: "Hello, how are you?"
 *                 conversationId:
 *                     type: integer
 *                     example: 1
 *                 createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-06-10T15:45:00Z"
 *
 *         GetConversationMessagesResponse:
 *             type: object
 *             required:
 *                 - hits
 *             properties:
 *                 hits:
 *                     type: array
 *                     items:
 *                         $ref: '#/components/schemas/Message'
 *
 *         ErrorParam:
 *             type: object
 *             required:
 *                 - name
 *                 - description
 *                 - unrecognizedValue
 *                 - allowedValues
 *             properties:
 *                 name:
 *                     type: string
 *                     description: The name of the invalid parameter
 *                     example: invalidParameterName
 *                 description:
 *                     type: string
 *                     description: Description of the problem
 *                     example: Invalid value format
 *                 UnrecognizedValue:
 *                     description: The value provided by the client that was not recognized
 *                     oneOf:
 *                         - type: string
 *                         - type: number
 *                         - type: boolean
 *                     example: foo
 *                 allowedValues:
 *                     type: any
 *                     description: List of valid values for this parameter
 *                     example:
 *                         - createdAt
 *                         - lastUpdate
 *
 *         InvalidParams:
 *             type: object
 *             required:
 *                 - title
 *                 - status
 *                 - detail
 *                 - invalidParams
 *             properties:
 *                 title:
 *                     type: string
 *                     enum:
 *                         - "Invalid Parameters"
 *                     example: "Invalid Parameters"
 *                     description: A short, fixed title describing the error
 *                 status:
 *                     type: integer
 *                     example: 400
 *                     description: HTTP status code
 *                 detail:
 *                     type: string
 *                     example: "One or more parameters are in an incorrect format."
 *                     description: A human-readable explanation of what went wrong
 *                 invalidParams:
 *                     type: array
 *                     items:
 *                         $ref: '#/components/schemas/ErrorParam'
 */
