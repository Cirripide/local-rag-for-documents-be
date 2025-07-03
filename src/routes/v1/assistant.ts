import express from "express";
import {getAssistantName} from "../../controllers/assistant-controller";
const router = express.Router();

/**
 * @openapi
 * /api/v1/assistant/name:
 *     get:
 *         summary: Get assistant name
 *         description: Returns the name of the assistant.
 *         responses:
 *             200:
 *                 description: OK
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 assistantName:
 *                                     type: string
 *                                     description: The name of the assistant
 *                                     example: "Finn"
 *             500:
 *                 description: Server Error
 */
router.get('/name', getAssistantName);

export default router;
