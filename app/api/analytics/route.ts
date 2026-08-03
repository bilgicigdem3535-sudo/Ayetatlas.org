import { env } from "cloudflare:workers";
import { z } from "zod";

export const runtime = "edge";
const schema = z.object({ sessionId: z.string().uuid(), eventName: z.enum(["page_view", "surah_selected", "verse_navigated", "audio_played", "blog_opened", "document_upload_started", "support_opened", "atlas_engine_opened"]), path: z.string().startsWith("/").max(200), properties: z.record(z.string(), z.union([z.string().max(100), z.number(), z.boolean()])).default({}) });

export async function POST(request: Request) {
  if (request.headers.get("Sec-GPC") === "1") return new Response(null, { status: 204 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const cookie = request.headers.get("Cookie") ?? "";
  const variant = cookie.match(/(?:^|;\s*)aa_reader=(control|focus)/)?.[1] ?? "control";
  const db = (env as unknown as { DB: D1Database }).DB;
  await db.prepare(`INSERT INTO analytics_events (id, tenant_id, session_id, event_name, path, variant, properties, created_at) VALUES (?, 'ayet-atlasi', ?, ?, ?, ?, ?, ?)`)
    .bind(crypto.randomUUID(), parsed.data.sessionId, parsed.data.eventName, parsed.data.path, variant, JSON.stringify(parsed.data.properties), Date.now()).run();
  return new Response(null, { status: 204 });
}
