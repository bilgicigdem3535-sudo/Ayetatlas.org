"use client";
import { useEffect, useState } from "react";

export const POLICY_VERSION = "2026-08-03.1";
export default function ConsentManager() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const task = window.setTimeout(() => setOpen(localStorage.getItem("ayet-consent-version") !== POLICY_VERSION), 0);
    return () => window.clearTimeout(task);
  }, []);
  const choose = (analytics: boolean) => {
    localStorage.setItem("ayet-consent-version", POLICY_VERSION);
    localStorage.setItem("ayet-consent-analytics", analytics ? "granted" : "denied");
    document.cookie = `consent_analytics=${analytics ? "granted" : "denied"}; Path=/; Max-Age=31536000; Secure; SameSite=Lax`;
    setOpen(false);
    if (analytics) location.reload();
  };
  if (!open) return <button className="consent-settings" onClick={() => setOpen(true)}>Gizlilik tercihleri</button>;
  return <section className="consent-panel" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description">
    <div><small>GİZLİLİK · SÜRÜM {POLICY_VERSION}</small><h2 id="consent-title">Tercih sizin</h2><p id="consent-description">Zorunlu çerezler güvenlik ve tema için kullanılır. Anonim ürün analitiği yalnız izninizle çalışır; IP, e-posta veya reklam profili saklamaz.</p><a href="/legal">Gizlilik ve kullanım koşullarını okuyun</a></div>
    <div className="consent-actions"><button onClick={() => choose(false)}>Yalnız zorunlu</button><button className="primary" onClick={() => choose(true)}>Anonim analitiğe izin ver</button></div>
  </section>;
}
