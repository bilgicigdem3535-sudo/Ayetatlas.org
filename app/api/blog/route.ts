import { env } from "cloudflare:workers";

export const runtime = "edge";

type BlogEnv = {
  DB: D1Database;
  BLOG_FILES: R2Bucket;
};

const bindings = env as unknown as BlogEnv;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

async function ensureSchema() {
  await bindings.DB.prepare(`CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surah_no INTEGER NOT NULL,
    surah_name TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    author_name TEXT NOT NULL DEFAULT 'Yazar',
    file_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'archived',
    created_at INTEGER NOT NULL
  )`).run();
  await bindings.DB.prepare("CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON blog_posts(created_at)").run();
}

export async function GET() {
  await ensureSchema();
  const result = await bindings.DB.prepare(`SELECT id, surah_no AS surahNo, surah_name AS surahName,
    title, excerpt, author_name AS authorName, file_name AS fileName, file_type AS fileType,
    file_size AS fileSize, status, created_at AS createdAt
    FROM blog_posts ORDER BY created_at DESC LIMIT 100`).all();
  return Response.json({ posts: result.results });
}

export async function POST(request: Request) {
  const authenticatedUserId = request.headers.get("oai-authenticated-user-id");
  if (!authenticatedUserId) return Response.json({ error: "Belge eklemek için güvenli oturum gereklidir." }, { status: 401 });
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (origin && origin !== requestUrl.origin) {
    return Response.json({ error: "Geçersiz istek kaynağı." }, { status: 403 });
  }
  const contentLength = Number(request.headers.get("Content-Length") ?? 0);
  if (contentLength > MAX_FILE_SIZE + 1024 * 1024) {
    return Response.json({ error: "İstek boyutu sınırı aşıyor." }, { status: 413 });
  }
  await ensureSchema();
  const form = await request.formData();
  if (String(form.get("website") ?? "").trim()) return Response.json({ error: "İstek doğrulanamadı." }, { status: 400 });
  const file = form.get("file");
  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const authorName = String(form.get("authorName") ?? "").trim() || "Yazar";
  const surahNo = Number(form.get("surahNo"));
  const surahName = String(form.get("surahName") ?? "").trim();

  if (title.length > 160 || excerpt.length > 600 || authorName.length > 80 || surahName.length > 80) {
    return Response.json({ error: "Metin alanlarından biri izin verilen uzunluğu aşıyor." }, { status: 400 });
  }

  if (!(file instanceof File) || !title || !surahName || !Number.isInteger(surahNo) || surahNo < 1 || surahNo > 114) {
    return Response.json({ error: "Başlık, sûre ve belge zorunludur." }, { status: 400 });
  }
  const extensionAllowed = /\.(docx|pdf)$/i.test(file.name);
  if (!allowedTypes.has(file.type) && !extensionAllowed) {
    return Response.json({ error: "Yalnızca Word (.docx) veya PDF belgesi yükleyebilirsiniz." }, { status: 415 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: "Belge 10 MB sınırını aşıyor." }, { status: 413 });
  }
  const signature = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const isPdf = signature[0] === 0x25 && signature[1] === 0x50 && signature[2] === 0x44 && signature[3] === 0x46 && signature[4] === 0x2d;
  const isDocx = signature[0] === 0x50 && signature[1] === 0x4b && signature[2] === 0x03 && signature[3] === 0x04;
  if ((file.name.toLowerCase().endsWith(".pdf") && !isPdf) || (file.name.toLowerCase().endsWith(".docx") && !isDocx)) {
    return Response.json({ error: "Belgenin içeriği dosya uzantısıyla uyuşmuyor." }, { status: 415 });
  }

  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "belge";
  const fileKey = `blog/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  await bindings.BLOG_FILES.put(fileKey, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream", contentDisposition: `attachment; filename="${safeName}"` },
    customMetadata: { surahNo: String(surahNo), surahName, authorName, uploadedBy: authenticatedUserId },
  });

  try {
    const createdAt = Date.now();
    const result = await bindings.DB.prepare(`INSERT INTO blog_posts
      (surah_no, surah_name, title, excerpt, author_name, file_key, file_name, file_type, file_size, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'archived', ?)`)
      .bind(surahNo, surahName, title, excerpt, authorName, fileKey, file.name, file.type || "application/octet-stream", file.size, createdAt)
      .run();
    return Response.json({ ok: true, id: result.meta.last_row_id }, { status: 201 });
  } catch (error) {
    await bindings.BLOG_FILES.delete(fileKey);
    throw error;
  }
}
