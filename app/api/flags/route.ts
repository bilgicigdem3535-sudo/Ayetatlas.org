import { env } from "cloudflare:workers";

export const runtime = "edge";
const defaults = [{ key: "reader-focus-mode", enabled: true, rolloutPercentage: 50, description: "Edge okuyucu deney varyantı" }, { key: "semantic-search", enabled: false, rolloutPercentage: 0, description: "Gelecek anlam araması" }];

export async function GET() {
  try {
    const db = (env as unknown as { DB: D1Database }).DB;
    const result = await db.prepare("SELECT key, enabled, rollout_percentage AS rolloutPercentage, description, updated_at AS updatedAt FROM feature_flags ORDER BY key").all();
    return Response.json({ flags: result.results.length ? result.results : defaults }, { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } });
  } catch { return Response.json({ flags: defaults }, { headers: { "Cache-Control": "public, max-age=30" } }); }
}
