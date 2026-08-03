import { env } from "cloudflare:workers";

export const runtime = "edge";
export async function GET(request: Request) {
  if (!request.headers.get("oai-authenticated-user-id")) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  const db = (env as unknown as { DB: D1Database }).DB;
  const since = Date.now() - 30 * 86400_000;
  const [events, funnel, experiments] = await db.batch([
    db.prepare("SELECT event_name AS eventName, COUNT(*) AS total, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE created_at >= ? GROUP BY event_name ORDER BY total DESC").bind(since),
    db.prepare("SELECT event_name AS step, COUNT(DISTINCT session_id) AS sessions FROM analytics_events WHERE created_at >= ? AND event_name IN ('page_view','surah_selected','verse_navigated','audio_played','blog_opened') GROUP BY event_name").bind(since),
    db.prepare("SELECT variant, COUNT(DISTINCT session_id) AS sessions, SUM(CASE WHEN event_name = 'verse_navigated' THEN 1 ELSE 0 END) AS verseActions FROM analytics_events WHERE created_at >= ? GROUP BY variant").bind(since),
  ]);
  return Response.json({ periodDays: 30, privacy: { storesIp: false, storesEmail: false, storesUserAgent: false }, events: events.results, funnel: funnel.results, experiments: experiments.results }, { headers: { "Cache-Control": "private, no-store" } });
}
