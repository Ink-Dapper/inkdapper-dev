import React, { useEffect, useMemo, useState } from "react";
import { Activity, RefreshCw, Trash2, Gauge, Clock3, Image as ImageIcon } from "lucide-react";
import api from "../utils/axios";
import { toast } from "react-toastify";

const formatMs = (value) => `${Math.round(Number(value || 0))} ms`;
const formatPct = (value) => `${Number(value || 0).toFixed(1)}%`;
const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const PerformanceReports = () => {
  const [hours, setHours] = useState(24);
  const [summary, setSummary] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [controlEnabled, setControlEnabled] = useState(false);
  const [controlLoading, setControlLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [cleanupDays, setCleanupDays] = useState(30);
  const [controlApiAvailable, setControlApiAvailable] = useState(true);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [checkStartTime, setCheckStartTime] = useState("");
  const [checkEndTime, setCheckEndTime] = useState("");
  const [checkStatus, setCheckStatus] = useState("idle");

  const loadData = async (targetPage = page) => {
    setLoading(true);
    try {
      const [summaryRes, reportsRes] = await Promise.all([
        api.get(`/performance-report/admin/summary?hours=${hours}`),
        api.get(`/performance-report/admin/reports?page=${targetPage}&limit=${limit}`),
      ]);

      setSummary(summaryRes.data?.summary || null);
      setReports(reportsRes.data?.reports || []);
      setPage(reportsRes.data?.page || 1);
      setTotalPages(reportsRes.data?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load performance report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [hours]);

  const loadControlState = async () => {
    try {
      const res = await api.get("/performance-report/control");
      setControlEnabled(Boolean(res.data?.isEnabled));
      setControlApiAvailable(true);
    } catch (error) {
      if (error?.response?.status === 404) {
        setControlApiAvailable(false);
        setControlEnabled(false);
        return;
      }
      console.error("Failed to load performance control state:", error);
    }
  };

  useEffect(() => {
    loadControlState();
  }, []);

  const kpiCards = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Reports", value: summary.totalReports || 0, icon: Activity },
      { label: "Avg Total Load", value: formatMs(summary.avgTotalLoadMs), icon: Gauge },
      { label: "Avg Route Delay", value: formatMs(summary.avgRouteRenderDelayMs), icon: Clock3 },
      { label: "Avg Image Load", value: formatMs(summary.avgImageLoadMs), icon: ImageIcon },
      { label: "Avg FCP", value: formatMs(summary.avgFcpMs), icon: Activity },
      { label: "Avg LCP", value: formatMs(summary.avgLcpMs), icon: Activity },
      { label: "Slow Network Share", value: formatPct(summary.slowNetworkSharePct), icon: Activity },
    ];
  }, [summary]);

  const handleCleanup = async (clearAll = false) => {
    if (clearAll) {
      const confirmed = window.confirm("Delete all performance reports?");
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const query = clearAll ? "clearAll=true" : `days=${Math.max(1, Number(cleanupDays || 30))}`;
      await api.delete(`/performance-report/admin/reports?${query}`);
      await loadData(1);
    } catch (error) {
      console.error("Failed to delete performance reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetControl = async (enabled) => {
    if (!controlApiAvailable) {
      toast.error("Performance control API not found. Restart/update backend server.");
      return;
    }

    if (enabled) {
      setShowStartDialog(true);
      setCheckStatus("running");
      setCheckStartTime(new Date().toLocaleString());
      setCheckEndTime("");
    }

    setControlLoading(true);
    try {
      const res = await api.patch("/performance-report/admin/control", { isEnabled: enabled });
      setControlEnabled(Boolean(res.data?.isEnabled));
      if (enabled) {
        await loadData(1);
        setCheckStatus("done");
        setCheckEndTime(new Date().toLocaleString());
      }
    } catch (error) {
      console.error("Failed to update performance control:", error);
      if (enabled) {
        setCheckStatus("error");
        setCheckEndTime(new Date().toLocaleString());
      }
    } finally {
      setControlLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showStartDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900">Performance Checking</h3>
            <p className="text-sm text-gray-600 mt-1">Loading start and end timing status.</p>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Start Time</span>
                <span className="font-semibold text-gray-800">{checkStartTime || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">End Time</span>
                <span className="font-semibold text-gray-800">{checkEndTime || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-semibold ${
                    checkStatus === "running"
                      ? "text-blue-600"
                      : checkStatus === "done"
                      ? "text-emerald-600"
                      : checkStatus === "error"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {checkStatus === "running" ? "Running..." : checkStatus === "done" ? "Completed" : checkStatus === "error" ? "Failed" : "-"}
                </span>
              </div>
            </div>

            {checkStatus === "running" && (
              <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-1/2 bg-blue-500 animate-pulse" />
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowStartDialog(false)}
                disabled={checkStatus === "running"}
                className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold disabled:opacity-40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Control & Performance Reports</h1>
            <p className="text-sm text-gray-500 mt-1">
              Frontend loading timing, delay timing, page impact and image loading performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSetControl(true)}
              disabled={controlLoading || controlEnabled}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50"
            >
              Start
            </button>
            <button
              onClick={() => handleSetControl(false)}
              disabled={controlLoading || !controlEnabled}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-semibold disabled:opacity-50"
            >
              Stop
            </button>
            <select
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value={6}>Last 6h</option>
              <option value={12}>Last 12h</option>
              <option value={24}>Last 24h</option>
              <option value={48}>Last 48h</option>
              <option value={168}>Last 7 days</option>
            </select>
            <button
              onClick={() => loadData(page)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-600">
          Reporting status:{" "}
          <span className={`font-semibold ${controlEnabled ? "text-emerald-700" : "text-gray-500"}`}>
            {controlEnabled ? "Started" : "Stopped"}
          </span>
        </p>
        {!controlApiAvailable && (
          <p className="mt-2 text-xs text-red-600 font-medium">
            Control API unavailable (404). Restart backend with latest code.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
        {kpiCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 md:p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className="w-4 h-4 text-orange-500" />
            </div>
            <p className="mt-2 text-base md:text-lg font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Most Affected Pages (Load Time)</h2>
          <div className="space-y-2">
            {(summary?.topSlowPages || []).map((item) => (
              <div key={item.path} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700 truncate pr-3">{item.path}</span>
                <span className="text-red-600 font-semibold">{formatMs(item.avgTotalLoadMs)}</span>
              </div>
            ))}
            {!summary?.topSlowPages?.length && <p className="text-sm text-gray-500">No data available.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Most Affected Pages (Image Speed)</h2>
          <div className="space-y-2">
            {(summary?.topAffectedPagesByImage || []).map((item) => (
              <div key={item.path} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2">
                <span className="font-medium text-gray-700 truncate pr-3">{item.path}</span>
                <span className="text-orange-600 font-semibold">{formatMs(item.avgImageLoadMs)}</span>
              </div>
            ))}
            {!summary?.topAffectedPagesByImage?.length && <p className="text-sm text-gray-500">No data available.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Control Panel</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            min={1}
            max={365}
            value={cleanupDays}
            onChange={(e) => setCleanupDays(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm w-28"
          />
          <button
            onClick={() => handleCleanup(false)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-600 text-white text-sm font-semibold"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Delete Older Data
          </button>
          <button
            onClick={() => handleCleanup(true)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Reports
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Raw Performance Reports</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Path</th>
                <th className="py-2 pr-3">Device</th>
                <th className="py-2 pr-3">Network</th>
                <th className="py-2 pr-3">Total Load</th>
                <th className="py-2 pr-3">Delay</th>
                <th className="py-2 pr-3">FCP</th>
                <th className="py-2 pr-3">LCP</th>
                <th className="py-2 pr-3">Image Avg</th>
                <th className="py-2 pr-3">Slow Img</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-gray-50">
                  <td className="py-2 pr-3 text-gray-600 whitespace-nowrap">{formatDateTime(report.createdAt)}</td>
                  <td className="py-2 pr-3 font-medium text-gray-800">{report.path}</td>
                  <td className="py-2 pr-3 text-gray-600">{report.deviceType}</td>
                  <td className="py-2 pr-3 text-gray-600">{report.connection?.effectiveType || "-"}</td>
                  <td className="py-2 pr-3 font-semibold text-red-600">{formatMs(report.timing?.totalLoadMs)}</td>
                  <td className="py-2 pr-3 font-semibold text-orange-600">{formatMs(report.timing?.routeRenderDelayMs)}</td>
                  <td className="py-2 pr-3">{formatMs(report.timing?.fcpMs)}</td>
                  <td className="py-2 pr-3">{formatMs(report.timing?.lcpMs)}</td>
                  <td className="py-2 pr-3">{formatMs(report.imageMetrics?.avgImageLoadMs)}</td>
                  <td className="py-2 pr-3">{report.imageMetrics?.slowImagesCount || 0}</td>
                </tr>
              ))}
              {!reports.length && (
                <tr>
                  <td colSpan={10} className="py-6 text-center text-gray-500">
                    No performance reports captured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => loadData(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </p>
          <button
            onClick={() => loadData(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || loading}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReports;
