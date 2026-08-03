import { env } from "cloudflare:workers";
import { blogUploadSchema } from "../../../lib/server/blog/validation";
import { findByIdempotencyKey, insertPostAndEvent, listBlogPosts, TENANT_ID, type BlogBindings } from "../../../lib/server/blog/repository";

export const runtime = "edge";
const bindings = env as unknown as BlogBindings;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

export async function GET() {
  const result = await listBlogPosts(bindings);
  return Response.json({ posts: result.results }, { headers: { "Cache-Control": "private, max-age=15" } });
}

export async function POST(request: Request) {
  const authenticatedUserId = request.headers.get("oai-authenticated-user-id");
  if (!authenticatedUserId) return Response.json({ error: "Belge eklemek için güvenli oturum gereklidir." }, { status: 401 });
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > MAX_FILE_SIZE + 1024 * 1024) return Response.json({ error: "İstek boyutu sınırı aşıyor." }, { status: 413 });

  const form = await request.formData();
  if (String(form.get("website") ?? "").trim()) return Response.json({ error: "İstek doğrulanamadı." }, { status: 400 });
  const file = form.get("file");
  const idempotencyKey = request.headers.get("Idempotency-Key") ?? "";
  const parsed = blogUploadSchema.safeParse({ title: form.get("title"), excerpt: form.get("excerpt") ?? "", authorName: form.get("authorName") || "Yazar", surahNo: form.get("surahNo"), surahName: form.get("surahName"), idempotencyKey });
  if (!(file instanceof File) || !parsed.success) return Response.json({ error: "Başlık, sûre, geçerli işlem anahtarı ve belge zorunludur." }, { status: 400 });
  const { title, excerpt, authorName, surahNo, surahName } = parsed.data;
  const existing = await findByIdempotencyKey(bindings, idempotencyKey);
  if (existing) return Response.json({ ok: true, id: existing.id, duplicate: true }, { status: 200 });

  const extensionAllowed = /\.(docx|pdf)$/i.test(file.name);
  if (!allowedTypes.has(file.type) && !extensionAllowed) return Response.json({ error: "Yalnızca Word (.docx) veya PDF belgesi yükleyebilirsiniz." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return Response.json({ error: "Belge 10 MB sınırını aşıyor." }, { status: 413 });
  const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdf = signature[0] === 0x25 && signature[1] === 0x50 && signature[2] === 0x44 && signature[3] === 0x46 && signature[4] === 0x2d;
  const isDocx = signature[0] === 0x50 && signature[1] === 0x4b && signature[2] === 0x03 && signature[3] === 0x04;
  if ((file.name.toLowerCase().endsWith(".pdf") && !isPdf) || (file.name.toLowerCase().endsWith(".docx") && !isDocx)) return Response.json({ error: "Belgenin içeriği dosya uzantısıyla uyuşmuyor." }, { status: 415 });

  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "belge";
  const fileKey = `blog/${TENANT_ID}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  await bindings.BLOG_FILES.put(fileKey, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream", contentDisposition: `attachment; filename="${safeName}"` }, customMetadata: { tenantId: TENANT_ID, surahNo: String(surahNo), surahName, authorName, uploadedBy: authenticatedUserId } });
  try {
    const result = await insertPostAndEvent(bindings, { surahNo, surahName, title, excerpt, authorName, fileKey, fileName: file.name, fileType: file.type || "application/octet-stream", fileSize: file.size, uploadedBy: authenticatedUserId, idempotencyKey });
    return Response.json({ ok: true, id: result.id, eventId: result.eventId }, { status: 201 });
  } catch (error) {
    await bindings.BLOG_FILES.delete(fileKey);
    throw error;
  }
}
