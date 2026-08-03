"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { navigator.sendBeacon("/api/telemetry", JSON.stringify({ schemaVersion: 1, sessionId: crypto.randomUUID(), path: location.pathname, events: [{ type: "error", name: "global-boundary", message: String(error.message || error.digest || "unknown").slice(0, 300) }] })); }, [error]);
  return <html lang="tr"><body><main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}><section><h1>Âyet Atlası geçici bir sorunla karşılaştı.</h1><p>Hata güvenli biçimde kaydedildi. Okuma alanını yeniden başlatabilirsiniz.</p><button onClick={reset}>Yeniden dene</button></section></main></body></html>;
}
