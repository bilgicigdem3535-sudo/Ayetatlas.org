import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Âyet Atlası — katmanlı Kur’an araştırması";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "76px 92px", color: "#12372c", background: "linear-gradient(135deg,#fffdf6 0%,#edf7f0 62%,#f5e8c9 100%)", fontFamily: "serif" }}><div style={{ display: "flex", alignItems: "center", gap: 20, color: "#b48736", fontSize: 28 }}>✦ <span style={{ letterSpacing: 5 }}>KATMANLI KUR’AN ARAŞTIRMASI</span></div><div style={{ display: "flex", marginTop: 38, fontSize: 94, lineHeight: 1 }}>Âyet Atlası</div><div style={{ display: "flex", marginTop: 28, maxWidth: 920, color: "#45675c", fontSize: 34, lineHeight: 1.45 }}>Arapça mushaf metninden lafza, köke, bağlama ve belgeye dayalı derin okuma.</div><div style={{ display: "flex", marginTop: 58, color: "#2b725b", fontSize: 25 }}>ayetatlas.org · Makrodan mikroya, mikrodan bütüne</div></div>, size);
}
