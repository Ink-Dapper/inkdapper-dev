import express from "express";
import { generateDesign } from "../controllers/aiController.js";

const aiRouter = express.Router();

// POST /api/ai/generate — generate a T-shirt design from a text prompt
aiRouter.post("/generate", generateDesign);

export default aiRouter;
