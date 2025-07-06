import express from "express";
import conversationsRoutes from "./conversations";
import assistantRoutes from "./assistant";
import indexingRoutes from "./indexing";

const router = express.Router();

router.use('/conversations', conversationsRoutes);
router.use('/assistant', assistantRoutes);
router.use('/indexing', indexingRoutes);

export default router;
