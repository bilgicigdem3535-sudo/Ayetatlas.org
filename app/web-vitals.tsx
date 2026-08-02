"use client";

import { useEffect } from "react";

type Metric = { name: "LCP" | "CLS" | "INP"; value: number };

export default function WebVitals() {
  useEffect(() => {
    const metrics = new Map<string, number>();
    const observe = (type: string, callback: (entry: PerformanceEntry) => void) => {
      try {
        const observer = new PerformanceObserver((list) => list.getEntries().forEach(callback));
        observer.observe({ type, buffered: true });
        return observer;
      } catch { return undefined; }
    };
    const observers = [
      observe("largest-contentful-paint", (entry) => metrics.set("LCP", entry.startTime)),
      observe("layout-shift", (entry) => {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!shift.hadRecentInput) metrics.set("CLS", (metrics.get("CLS") ?? 0) + shift.value);
      }),
      observe("event", (entry) => {
        const event = entry as PerformanceEntry & { duration: number; interactionId?: number };
        if (event.interactionId && event.duration > (metrics.get("INP") ?? 0)) metrics.set("INP", event.duration);
      }),
    ];
    const send = () => {
      const payload: Metric[] = [...metrics].map(([name, value]) => ({ name: name as Metric["name"], value: Math.round(value * 1000) / 1000 }));
      if (payload.length) navigator.sendBeacon("/api/vitals", JSON.stringify({ path: location.pathname, metrics: payload }));
    };
    addEventListener("pagehide", send, { once: true });
    return () => { observers.forEach((observer) => observer?.disconnect()); removeEventListener("pagehide", send); };
  }, []);
  return null;
}
