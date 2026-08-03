"use client";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#faf8f1", color: "#13231d" }}><section style={{ maxWidth: 560, textAlign: "center" }}><p style={{ color: "#c89a42", letterSpacing: 1 }}>ÂYET ATLASI</p><h1 style={{ fontFamily: "Georgia,serif" }}>Bu bölüm şu anda açılamadı.</h1><p>Okuma konumunuz korunuyor. Bağlantıyı veya geçici kaynak sorununu yeniden deneyebilirsiniz.</p><button onClick={reset} style={{ border: 0, borderRadius: 12, padding: "12px 18px", color: "white", background: "#286d59", cursor: "pointer" }}>Yeniden dene</button></section></main>;
}
