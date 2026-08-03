"use client";
import { useEffect } from "react";

const SESSION_KEY = "ayet-atlasi-analytics-session";
const allowedEvents = new Set(["page_view", "surah_selected", "verse_navigated", "audio_played", "blog_opened", "document_upload_started", "support_opened", "atlas_engine_opened"]);

export function trackProductEvent(eventName: string, properties: Record<string, string | number | boolean> = {}) {
  if (!allowedEvents.has(eventName) || navigator.globalPrivacyControl) return;
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) { sessionId = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, sessionId); }
  navigator.sendBeacon("/api/analytics", JSON.stringify({ sessionId, eventName, path: location.pathname, properties }));
}

export default function Analytics() {
  useEffect(() => {
    trackProductEvent("page_view");
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest("button");
      if (!button) return;
      const label = `${button.getAttribute("aria-label") ?? ""} ${button.textContent ?? ""}`;
      if (/Sonraki|Önceki/.test(label)) trackProductEvent("verse_navigated");
      else if (/Blog/.test(label)) trackProductEvent("blog_opened");
      else if (/Hâlden Âyete/.test(label)) trackProductEvent("support_opened");
      else if (/Atlas Omurgası/.test(label)) trackProductEvent("atlas_engine_opened");
      else if (button.classList.contains("surah")) trackProductEvent("surah_selected");
    };
    const onPlay = () => trackProductEvent("audio_played");
    addEventListener("click", onClick);
    document.addEventListener("play", onPlay, true);
    return () => { removeEventListener("click", onClick); document.removeEventListener("play", onPlay, true); };
  }, []);
  return null;
}
