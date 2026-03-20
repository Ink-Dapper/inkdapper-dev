import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  collectPerformanceReport,
  deletePerformanceReports,
  getPerformanceControl,
  getPerformanceReports,
  getPerformanceSummary,
  setPerformanceControl,
} from "../controllers/performanceReportController.js";

const performanceReportRouter = express.Router();

// Public endpoint used by storefront to submit performance metrics
performanceReportRouter.post("/collect", collectPerformanceReport);
performanceReportRouter.get("/control", getPerformanceControl);

// Admin-only reporting + control endpoints
performanceReportRouter.patch("/admin/control", adminAuth, setPerformanceControl);
performanceReportRouter.get("/admin/summary", adminAuth, getPerformanceSummary);
performanceReportRouter.get("/admin/reports", adminAuth, getPerformanceReports);
performanceReportRouter.delete("/admin/reports", adminAuth, deletePerformanceReports);

export default performanceReportRouter;
