export type BlogBindings = { DB: D1Database; BLOG_FILES: R2Bucket };
export const TENANT_ID = "ayet-atlasi";

export async function listBlogPosts(bindings: BlogBindings) {
  return bindings.DB.prepare(`SELECT id, surah_no AS surahNo, surah_name AS surahName,
    title, excerpt, author_name AS authorName, file_name AS fileName, file_type AS fileType,
    file_size AS fileSize, status, created_at AS createdAt
    FROM blog_posts WHERE tenant_id = ? AND deleted_at IS NULL
    ORDER BY created_at DESC LIMIT 100`).bind(TENANT_ID).all();
}

export async function findByIdempotencyKey(bindings: BlogBindings, key: string) {
  return bindings.DB.prepare("SELECT id FROM blog_posts WHERE tenant_id = ? AND idempotency_key = ? LIMIT 1").bind(TENANT_ID, key).first<{ id: number }>();
}

export async function insertPostAndEvent(bindings: BlogBindings, values: {
  surahNo: number; surahName: string; title: string; excerpt: string; authorName: string;
  fileKey: string; fileName: string; fileType: string; fileSize: number; uploadedBy: string; idempotencyKey: string;
}) {
  const createdAt = Date.now();
  const eventId = crypto.randomUUID();
  const insert = bindings.DB.prepare(`INSERT INTO blog_posts
    (tenant_id, surah_no, surah_name, title, excerpt, author_name, file_key, file_name, file_type, file_size, status, uploaded_by, idempotency_key, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'archived', ?, ?, ?, ?)`)
    .bind(TENANT_ID, values.surahNo, values.surahName, values.title, values.excerpt, values.authorName, values.fileKey, values.fileName, values.fileType, values.fileSize, values.uploadedBy, values.idempotencyKey, createdAt, createdAt);
  const outbox = bindings.DB.prepare(`INSERT INTO outbox_events
    (id, tenant_id, event_type, aggregate_id, payload, status, attempts, available_at, created_at)
    VALUES (?, ?, 'blog.document.uploaded', ?, ?, 'pending', 0, ?, ?)`)
    .bind(eventId, TENANT_ID, values.idempotencyKey, JSON.stringify({ fileKey: values.fileKey, surahNo: values.surahNo }), createdAt, createdAt);
  const results = await bindings.DB.batch([insert, outbox]);
  return { id: results[0].meta.last_row_id, eventId };
}
