import PerformanceReport from "../models/performanceReportModel.js";
import PerformanceControl from "../models/performanceControlModel.js";

const num = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeString = (value, max = 300) => String(value || "").slice(0, max);

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
};

const collectPerformanceReport = async (req, res) => {
  try {
    const control = await PerformanceControl.findOne({ key: "global" }).lean();
    if (!control?.isEnabled) {
      return res.json({ success: true, skipped: true, message: "Performance reporting is disabled" });
    }

    const body = req.body || {};
    const path = sanitizeString(body.path, 200);
    if (!path) {
      return res.status(400).json({ success: false, message: "path is required" });
    }

    const report = await PerformanceReport.create({
      path,
      fullUrl: sanitizeString(body.fullUrl, 500),
      deviceType: sanitizeString(body.deviceType, 40) || "unknown",
      userAgent: sanitizeString(body.userAgent || req.headers["user-agent"], 400),
      connection: {
        effectiveType: sanitizeString(body.connection?.effectiveType, 20),
        rttMs: num(body.connection?.rttMs),
        downlinkMbps: num(body.connection?.downlinkMbps),
        saveData: parseBoolean(body.connection?.saveData),
      },
      timing: {
        ttfbMs: num(body.timing?.ttfbMs),
        domContentLoadedMs: num(body.timing?.domContentLoadedMs),
        loadEventMs: num(body.timing?.loadEventMs),
        totalLoadMs: num(body.timing?.totalLoadMs),
        routeRenderDelayMs: num(body.timing?.routeRenderDelayMs),
        fcpMs: num(body.timing?.fcpMs),
        lcpMs: num(body.timing?.lcpMs),
        cls: num(body.timing?.cls),
      },
      imageMetrics: {
        totalImages: num(body.imageMetrics?.totalImages),
        avgImageLoadMs: num(body.imageMetrics?.avgImageLoadMs),
        maxImageLoadMs: num(body.imageMetrics?.maxImageLoadMs),
        slowImagesCount: num(body.imageMetrics?.slowImagesCount),
        slowestImages: Array.isArray(body.imageMetrics?.slowestImages)
          ? body.imageMetrics.slowestImages.slice(0, 10).map((img) => ({
              name: sanitizeString(img?.name, 300),
              durationMs: num(img?.durationMs),
              transferSizeKb: num(img?.transferSizeKb),
            }))
          : [],
      },
      pageMemory: {
        usedJSHeapMb: num(body.pageMemory?.usedJSHeapMb),
        totalJSHeapMb: num(body.pageMemory?.totalJSHeapMb),
      },
    });

    return res.json({ success: true, id: report._id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPerformanceControl = async (_req, res) => {
  try {
    const control = await PerformanceControl.findOne({ key: "global" }).lean();
    return res.json({ success: true, isEnabled: Boolean(control?.isEnabled) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const setPerformanceControl = async (req, res) => {
  try {
    const isEnabled = parseBoolean(req.body?.isEnabled);
    const control = await PerformanceControl.findOneAndUpdate(
      { key: "global" },
      { $set: { isEnabled } },
      { new: true, upsert: true }
    );
    return res.json({ success: true, isEnabled: Boolean(control?.isEnabled) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPerformanceSummary = async (req, res) => {
  try {
    const hours = Math.min(Math.max(parseInt(req.query.hours || "24", 10), 1), 168);
    const fromDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const reports = await PerformanceReport.find({ createdAt: { $gte: fromDate } })
      .sort({ createdAt: -1 })
      .limit(4000)
      .lean();

    const totalReports = reports.length;
    if (!totalReports) {
      return res.json({
        success: true,
        summary: {
          totalReports: 0,
          avgTotalLoadMs: 0,
          avgRouteRenderDelayMs: 0,
          avgFcpMs: 0,
          avgLcpMs: 0,
          avgImageLoadMs: 0,
          slowNetworkSharePct: 0,
          topSlowPages: [],
          topAffectedPagesByImage: [],
        },
      });
    }

    const sum = {
      totalLoad: 0,
      routeDelay: 0,
      fcp: 0,
      lcp: 0,
      imageLoad: 0,
      slowNetworkCount: 0,
    };
    const pageStats = new Map();

    for (const r of reports) {
      const timing = r.timing || {};
      const imageMetrics = r.imageMetrics || {};
      const connection = r.connection || {};
      const key = r.path || "/";

      sum.totalLoad += num(timing.totalLoadMs);
      sum.routeDelay += num(timing.routeRenderDelayMs);
      sum.fcp += num(timing.fcpMs);
      sum.lcp += num(timing.lcpMs);
      sum.imageLoad += num(imageMetrics.avgImageLoadMs);

      const slowConnection =
        parseBoolean(connection.saveData) ||
        ["slow-2g", "2g", "3g"].includes(String(connection.effectiveType || "").toLowerCase());
      if (slowConnection) sum.slowNetworkCount += 1;

      if (!pageStats.has(key)) {
        pageStats.set(key, {
          path: key,
          reports: 0,
          totalLoad: 0,
          routeDelay: 0,
          imageAvg: 0,
        });
      }
      const s = pageStats.get(key);
      s.reports += 1;
      s.totalLoad += num(timing.totalLoadMs);
      s.routeDelay += num(timing.routeRenderDelayMs);
      s.imageAvg += num(imageMetrics.avgImageLoadMs);
    }

    const pages = Array.from(pageStats.values()).map((s) => ({
      path: s.path,
      reports: s.reports,
      avgTotalLoadMs: s.reports ? s.totalLoad / s.reports : 0,
      avgRouteRenderDelayMs: s.reports ? s.routeDelay / s.reports : 0,
      avgImageLoadMs: s.reports ? s.imageAvg / s.reports : 0,
    }));

    const topSlowPages = [...pages]
      .sort((a, b) => b.avgTotalLoadMs - a.avgTotalLoadMs)
      .slice(0, 8);

    const topAffectedPagesByImage = [...pages]
      .sort((a, b) => b.avgImageLoadMs - a.avgImageLoadMs)
      .slice(0, 8);

    return res.json({
      success: true,
      summary: {
        totalReports,
        avgTotalLoadMs: sum.totalLoad / totalReports,
        avgRouteRenderDelayMs: sum.routeDelay / totalReports,
        avgFcpMs: sum.fcp / totalReports,
        avgLcpMs: sum.lcp / totalReports,
        avgImageLoadMs: sum.imageLoad / totalReports,
        slowNetworkSharePct: (sum.slowNetworkCount / totalReports) * 100,
        topSlowPages,
        topAffectedPagesByImage,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPerformanceReports = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "25", 10), 1), 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.path) query.path = req.query.path;
    if (req.query.deviceType) query.deviceType = req.query.deviceType;
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) query.createdAt.$lte = new Date(req.query.to);
    }

    const [total, reports] = await Promise.all([
      PerformanceReport.countDocuments(query),
      PerformanceReport.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      reports,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deletePerformanceReports = async (req, res) => {
  try {
    const clearAll = parseBoolean(req.query.clearAll);

    let result;
    if (clearAll) {
      result = await PerformanceReport.deleteMany({});
    } else {
      const days = Math.min(Math.max(parseInt(req.query.days || "30", 10), 1), 365);
      const beforeDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      result = await PerformanceReport.deleteMany({ createdAt: { $lt: beforeDate } });
    }

    return res.json({
      success: true,
      deletedCount: result.deletedCount || 0,
      message: "Performance reports deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  collectPerformanceReport,
  getPerformanceControl,
  setPerformanceControl,
  getPerformanceSummary,
  getPerformanceReports,
  deletePerformanceReports,
};
