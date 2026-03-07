import mongoose from "mongoose";

const performanceControlSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "global" },
    isEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PerformanceControl = mongoose.model("PerformanceControl", performanceControlSchema);

export default PerformanceControl;
