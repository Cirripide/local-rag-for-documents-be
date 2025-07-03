import express from "express";
import conversationsRoutes from "./conversations";
import assistantRoutes from "./assistant";

const router = express.Router();

router.use('/conversations', conversationsRoutes);
router.use('/assistant', assistantRoutes);

export default router;
