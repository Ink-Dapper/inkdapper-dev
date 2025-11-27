import express from "express";
import { aiChat, chatHealth } from "../controllers/chatController.js";

const chatRouter = express.Router();

// Health check
chatRouter.get("/health", chatHealth);

// AI chat endpoint
chatRouter.post("/ai", aiChat);

export default chatRouter;


