import mongoose from "mongoose";

const imageTimingSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    durationMs: { type: Number, default: 0 },
    transferSizeKb: { type: Number, default: 0 },
  },
  { _id: false }
);

const performanceReportSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true },
    fullUrl: { type: String, default: "" },
    deviceType: { type: String, default: "unknown", index: true },
    userAgent: { type: String, default: "" },
    connection: {
      effectiveType: { type: String, default: "" },
      rttMs: { type: Number, default: 0 },
      downlinkMbps: { type: Number, default: 0 },
      saveData: { type: Boolean, default: false },
    },
    timing: {
      ttfbMs: { type: Number, default: 0 },
      domContentLoadedMs: { type: Number, default: 0 },
      loadEventMs: { type: Number, default: 0 },
      totalLoadMs: { type: Number, default: 0 },
      routeRenderDelayMs: { type: Number, default: 0 },
      fcpMs: { type: Number, default: 0 },
      lcpMs: { type: Number, default: 0 },
      cls: { type: Number, default: 0 },
    },
    imageMetrics: {
      totalImages: { type: Number, default: 0 },
      avgImageLoadMs: { type: Number, default: 0 },
      maxImageLoadMs: { type: Number, default: 0 },
      slowImagesCount: { type: Number, default: 0 },
      slowestImages: { type: [imageTimingSchema], default: [] },
    },
    pageMemory: {
      usedJSHeapMb: { type: Number, default: 0 },
      totalJSHeapMb: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

performanceReportSchema.index({ createdAt: -1 });
performanceReportSchema.index({ path: 1, createdAt: -1 });

const PerformanceReport = mongoose.model("PerformanceReport", performanceReportSchema);

export default PerformanceReport;
