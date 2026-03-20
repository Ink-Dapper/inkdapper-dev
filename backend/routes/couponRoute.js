import express from "express";
import {
  createCouponBatch,
  validateCoupon,
  testCoupon,
  getAvailableCoupons,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  bulkDeleteCoupons,
  toggleCouponStatus,
  getCouponStats
} from "../controllers/couponController.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// User routes (require authentication)
router.get("/test", testCoupon);
router.get("/available", getAvailableCoupons);
router.post("/validate", authUser, validateCoupon);

// Admin routes (require admin authentication)
router.post("/create-batch", adminAuth, createCouponBatch);
router.get("/all", adminAuth, getAllCoupons);
router.get("/stats", adminAuth, getCouponStats);
router.delete("/bulk", adminAuth, bulkDeleteCoupons);
router.get("/:id", adminAuth, getCouponById);
router.put("/:id", adminAuth, updateCoupon);
router.delete("/:id", adminAuth, deleteCoupon);
router.patch("/:id/toggle", adminAuth, toggleCouponStatus);

export default router;

