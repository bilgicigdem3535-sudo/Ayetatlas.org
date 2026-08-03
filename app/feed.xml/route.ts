import { verseStudyEntries } from "../content";

export const runtime = "edge";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[char] ?? char);

export async function GET() {
  const items = verseStudyEntries.slice(-30).reverse().map(([key, study]) => `<item><title>Âyet çalışması ${key}</title><link>https://ayetatlas.org/api/content?surah=${key.split(":")[0]}&amp;ayah=${key.split(":")[1]}</link><guid isPermaLink="false">quran:${key}:tr-study-v1</guid><description>${escapeXml(study.literalFocus)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Âyet Atlası içerik akışı</title><link>https://ayetatlas.org/</link><description>Yeni ve güncellenen âyet çalışmaları</description><language>tr</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
