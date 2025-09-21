import express from "express";
import {
  addHighlightedProduct,
  getHighlightedProducts,
  getAllHighlightedProducts,
  updateHighlightedProduct,
  deleteHighlightedProduct,
  toggleHighlightedProduct
} from "../controllers/highlightedProductController.js";
import adminAuth from "../middleware/adminAuth.js";

const highlightedProductRouter = express.Router();

// Public routes (for frontend)
highlightedProductRouter.get("/", getHighlightedProducts);

// Admin routes
highlightedProductRouter.post("/add", adminAuth, addHighlightedProduct);
highlightedProductRouter.get("/admin/all", adminAuth, getAllHighlightedProducts);
highlightedProductRouter.put("/update/:id", adminAuth, updateHighlightedProduct);
highlightedProductRouter.delete("/delete/:id", adminAuth, deleteHighlightedProduct);
highlightedProductRouter.patch("/toggle/:id", adminAuth, toggleHighlightedProduct);

export default highlightedProductRouter;
