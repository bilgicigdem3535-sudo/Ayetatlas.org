import { env } from "cloudflare:workers";
export const runtime = "edge";
type PrivacyEnv = { DB: D1Database; BLOG_FILES: R2Bucket };
export async function DELETE(request: Request) {
  const userId = request.headers.get("oai-authenticated-user-id");
  if (!userId) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  const bindings = env as unknown as PrivacyEnv;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(userId));
  const anonymousId = `deleted:${[...new Uint8Array(digest)].slice(0, 8).map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const files = await bindings.DB.prepare("SELECT file_key AS fileKey FROM blog_posts WHERE uploaded_by = ? AND deleted_at IS NULL").bind(userId).all<{ fileKey: string }>();
  await Promise.all(files.results.map((item) => bindings.BLOG_FILES.delete(item.fileKey)));
  const now = Date.now();
  await bindings.DB.batch([bindings.DB.prepare("UPDATE blog_posts SET uploaded_by = ?, author_name = 'Silinmiş kullanıcı', deleted_at = ?, updated_at = ? WHERE uploaded_by = ?").bind(anonymousId, now, now, userId), bindings.DB.prepare("UPDATE audit_logs SET actor_id = ?, metadata = '{}' WHERE actor_id = ?").bind(anonymousId, userId)]);
  return Response.json({ ok: true, deletedFiles: files.results.length, anonymizedIdentity: true });
}
