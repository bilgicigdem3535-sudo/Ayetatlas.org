import { env } from "cloudflare:workers";
export const runtime = "edge";
export async function GET(request: Request) {
  const userId = request.headers.get("oai-authenticated-user-id");
  if (!userId) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  const db = (env as unknown as { DB: D1Database }).DB;
  const [posts, audit] = await db.batch([db.prepare("SELECT surah_no AS surahNo, surah_name AS surahName, title, excerpt, author_name AS authorName, file_name AS fileName, status, created_at AS createdAt FROM blog_posts WHERE uploaded_by = ?").bind(userId), db.prepare("SELECT action, resource_type AS resourceType, created_at AS createdAt FROM audit_logs WHERE actor_id = ?").bind(userId)]);
  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const lines = ["type,surah,title,status,createdAt", ...posts.results.map((row) => `blog,${JSON.stringify(row.surahName)},${JSON.stringify(row.title)},${row.status},${row.createdAt}`), ...audit.results.map((row) => `audit,,${JSON.stringify(row.action)},,${row.createdAt}`)];
    return new Response(lines.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=ayet-atlasi-verilerim.csv", "Cache-Control": "private, no-store" } });
  }
  return Response.json({ exportedAt: new Date().toISOString(), blogPosts: posts.results, auditActions: audit.results }, { headers: { "Content-Disposition": "attachment; filename=ayet-atlasi-verilerim.json", "Cache-Control": "private, no-store" } });
}
