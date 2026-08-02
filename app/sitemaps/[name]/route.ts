import { verseStudyEntries } from "../../content";

const origin = "https://ayetatlas.org";
const entry = (path: string, priority: string) => `<url><loc>${origin}${path}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  const urls = name === "core.xml" ? [entry("/", "1.0")] : name === "content-1.xml" ? verseStudyEntries.map(([key]) => { const [surah, ayah] = key.split(":"); return entry(`/ayet/${surah}/${ayah}`, "0.8"); }) : null;
  if (!urls) return new Response("Sitemap bulunamadı", { status: 404 });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
}
