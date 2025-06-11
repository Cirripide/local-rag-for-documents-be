import express from "express";
import conversationsRoutes from "./conversations";

const router = express.Router();

router.use('/conversations', conversationsRoutes);

export default router;
