const origin = "https://ayetatlas.org";

export function GET() {
  const updated = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${origin}/sitemaps/core.xml</loc><lastmod>${updated}</lastmod></sitemap>\n  <sitemap><loc>${origin}/sitemaps/content-1.xml</loc><lastmod>${updated}</lastmod></sitemap>\n</sitemapindex>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
}
