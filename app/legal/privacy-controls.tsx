"use client";
import { useState } from "react";
export default function PrivacyControls() {
  const [message, setMessage] = useState("");
  const forget = async () => { if (!confirm("Size bağlı belge ve kişisel kayıtlar silinsin veya anonimleştirilsin mi?")) return; const response = await fetch("/api/privacy/me", { method: "DELETE" }); const result = await response.json() as { error?: string; deletedFiles?: number }; setMessage(response.ok ? `${result.deletedFiles ?? 0} belge dosyası kaldırıldı; kimlik alanları anonimleştirildi.` : result.error ?? "İşlem tamamlanamadı."); };
  return <section><h2>Veri hakları merkezi</h2><div className="privacy-actions"><a href="/api/privacy/export">Verilerimi JSON indir</a><a href="/api/privacy/export?format=csv">Verilerimi CSV indir</a><button onClick={forget}>Beni unut</button></div>{message && <p aria-live="polite">{message}</p>}</section>;
}
