import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import apiInstance from "../utils/axios";

const MAX_SLOW_IMAGES = 8;
const REPORT_DELAY_MS = 4500;
const CONTROL_CACHE_KEY = "perf-control-enabled";
const CONTROL_CACHE_TS_KEY = "perf-control-enabled-ts";
const CONTROL_TTL_MS = 60 * 1000;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toKb = (value) => toNumber(value) / 1024;

const getPageMemory = () => {
  if (!performance?.memory) {
    return { usedJSHeapMb: 0, totalJSHeapMb: 0 };
  }

  return {
    usedJSHeapMb: toNumber(performance.memory.usedJSHeapSize) / (1024 * 1024),
    totalJSHeapMb: toNumber(performance.memory.totalJSHeapSize) / (1024 * 1024),
  };
};

const PerformanceTracker = () => {
  const location = useLocation();
  const routeStartRef = useRef(performance.now());
  const latestLcpRef = useRef(0);
  const latestClsRef = useRef(0);

  useEffect(() => {
    let lcpObserver;
    let clsObserver;

    try {
      lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (!entries.length) return;
        const last = entries[entries.length - 1];
        latestLcpRef.current = toNumber(last.startTime);
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (_) {}

    try {
      clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            latestClsRef.current += toNumber(entry.value);
          }
        }
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (_) {}

    return () => {
      if (lcpObserver) lcpObserver.disconnect();
      if (clsObserver) clsObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    routeStartRef.current = performance.now();
    const currentPath = location.pathname + location.search;
    const reportKey = `perf-report:${currentPath}`;

    const shouldSkip = () => {
      const previous = Number(sessionStorage.getItem(reportKey) || 0);
      return Date.now() - previous < 30_000;
    };

    if (shouldSkip()) return undefined;

    const timeoutId = setTimeout(async () => {
      try {
        const nowTs = Date.now();
        const lastControlFetchTs = Number(localStorage.getItem(CONTROL_CACHE_TS_KEY) || 0);
        let isEnabled = localStorage.getItem(CONTROL_CACHE_KEY) === "true";

        if (!lastControlFetchTs || nowTs - lastControlFetchTs > CONTROL_TTL_MS) {
          try {
            const controlRes = await apiInstance.get("/performance-report/control");
            isEnabled = Boolean(controlRes.data?.isEnabled);
            localStorage.setItem(CONTROL_CACHE_KEY, String(isEnabled));
            localStorage.setItem(CONTROL_CACHE_TS_KEY, String(nowTs));
          } catch (_) {}
        }

        if (!isEnabled) return;

        const now = performance.now();
        const routeStartMs = routeStartRef.current;

        const navEntry = performance.getEntriesByType("navigation")[0];
        const paintEntries = performance.getEntriesByType("paint");
        const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint");

        const imageResources = performance
          .getEntriesByType("resource")
          .filter(
            (entry) =>
              entry.initiatorType === "img" &&
              entry.startTime >= routeStartMs - 100 &&
              entry.startTime <= now + 100
          );

        const imageDurations = imageResources.map((entry) => toNumber(entry.duration)).filter(Boolean);
        const avgImageLoadMs = imageDurations.length
          ? imageDurations.reduce((acc, d) => acc + d, 0) / imageDurations.length
          : 0;
        const maxImageLoadMs = imageDurations.length ? Math.max(...imageDurations) : 0;
        const slowImages = imageResources
          .filter((entry) => toNumber(entry.duration) >= 800)
          .sort((a, b) => toNumber(b.duration) - toNumber(a.duration))
          .slice(0, MAX_SLOW_IMAGES)
          .map((entry) => ({
            name: entry.name,
            durationMs: toNumber(entry.duration),
            transferSizeKb: toKb(entry.transferSize || entry.encodedBodySize || 0),
          }));

        const connection = navigator.connection || {};

        const payload = {
          path: currentPath,
          fullUrl: window.location.href,
          deviceType: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop",
          userAgent: navigator.userAgent,
          connection: {
            effectiveType: connection.effectiveType || "",
            rttMs: toNumber(connection.rtt),
            downlinkMbps: toNumber(connection.downlink),
            saveData: Boolean(connection.saveData),
          },
          timing: {
            ttfbMs: toNumber(navEntry?.responseStart) - toNumber(navEntry?.requestStart),
            domContentLoadedMs: toNumber(navEntry?.domContentLoadedEventEnd),
            loadEventMs: toNumber(navEntry?.loadEventEnd),
            totalLoadMs: toNumber(navEntry?.duration),
            routeRenderDelayMs: now - routeStartMs,
            fcpMs: toNumber(fcpEntry?.startTime),
            lcpMs: toNumber(latestLcpRef.current),
            cls: Number(toNumber(latestClsRef.current).toFixed(4)),
          },
          imageMetrics: {
            totalImages: imageResources.length,
            avgImageLoadMs,
            maxImageLoadMs,
            slowImagesCount: slowImages.length,
            slowestImages: slowImages,
          },
          pageMemory: getPageMemory(),
        };

        await apiInstance.post("/performance-report/collect", payload, {
          headers: { "Content-Type": "application/json" },
        });

        sessionStorage.setItem(reportKey, String(Date.now()));
      } catch (_) {}
    }, REPORT_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  return null;
};

export default PerformanceTracker;
