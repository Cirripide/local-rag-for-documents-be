import express from "express";
import {ragIndexingController} from "../../controllers/indexing-controller";
const router = express.Router();

/**
 * @openapi
 * /api/v1/indexing:
 *     post:
 *         summary: Start a new RAG indexing process
 *         description: Triggers the backend process that indexes data for Retrieval-Augmented Generation (RAG). Returns immediately after triggering the task.
 *         responses:
 *             202:
 *                 description: Indexing process started
 *                 content:
 *                     application/json:
 *                         schema:
 *                             type: object
 *                             properties:
 *                                 status:
 *                                     type: string
 *                                     example: "started"
 *             500:
 *                 description: Server Error
 */
router.post('/', ragIndexingController);

export default router;
