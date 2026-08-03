"use client";

import { useEffect } from "react";

type TelemetryEvent = { type: "metric" | "error" | "long-task"; name: string; value?: number; message?: string };

export default function WebVitals() {
  useEffect(() => {
    const sessionId = crypto.randomUUID();
    const events: TelemetryEvent[] = [];
    const observe = (type: string, callback: (entry: PerformanceEntry) => void) => {
      try { const observer = new PerformanceObserver((list) => list.getEntries().forEach(callback)); observer.observe({ type, buffered: true }); return observer; } catch { return undefined; }
    };
    let cls = 0;
    const observers = [
      observe("largest-contentful-paint", (entry) => events.push({ type: "metric", name: "LCP", value: entry.startTime })),
      observe("layout-shift", (entry) => { const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }; if (!shift.hadRecentInput) cls += shift.value; }),
      observe("event", (entry) => { const event = entry as PerformanceEntry & { duration: number; interactionId?: number }; if (event.interactionId) events.push({ type: "metric", name: "INP", value: event.duration }); }),
      observe("longtask", (entry) => events.push({ type: "long-task", name: "main-thread", value: entry.duration })),
    ];
    const onError = (event: ErrorEvent) => events.push({ type: "error", name: "window.error", message: String(event.message || "unknown").slice(0, 300) });
    const onRejection = () => events.push({ type: "error", name: "unhandledrejection", message: "Unhandled promise rejection" });
    addEventListener("error", onError);
    addEventListener("unhandledrejection", onRejection);
    const send = () => {
      events.push({ type: "metric", name: "CLS", value: cls });
      const payload = { schemaVersion: 1, sessionId, path: location.pathname, navigation: performance.getEntriesByType("navigation")[0]?.toJSON(), events: events.slice(-40) };
      navigator.sendBeacon("/api/telemetry", JSON.stringify(payload));
    };
    addEventListener("pagehide", send, { once: true });
    return () => { observers.forEach((observer) => observer?.disconnect()); removeEventListener("error", onError); removeEventListener("unhandledrejection", onRejection); removeEventListener("pagehide", send); };
  }, []);
  return null;
}
