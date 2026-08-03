import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tenantId: text("tenant_id").notNull().default("ayet-atlasi"),
  surahNo: integer("surah_no").notNull(),
  surahName: text("surah_name").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  authorName: text("author_name").notNull().default("Yazar"),
  fileKey: text("file_key").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("review"),
  uploadedBy: text("uploaded_by").notNull().default("system"),
  idempotencyKey: text("idempotency_key"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  deletedAt: integer("deleted_at", { mode: "timestamp" }),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
}, (table) => [
  index("idx_blog_posts_tenant_status_created").on(table.tenantId, table.status, table.createdAt),
  uniqueIndex("uq_blog_posts_tenant_idempotency").on(table.tenantId, table.idempotencyKey),
]);

export const outboxEvents = sqliteTable("outbox_events", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  eventType: text("event_type").notNull(),
  aggregateId: text("aggregate_id").notNull(),
  payload: text("payload").notNull(),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  availableAt: integer("available_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  processedAt: integer("processed_at", { mode: "timestamp" }),
}, (table) => [index("idx_outbox_status_available").on(table.status, table.availableAt)]);

export const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  actorId: text("actor_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  traceId: text("trace_id").notNull(),
  metadata: text("metadata").notNull().default("{}"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("idx_audit_tenant_created").on(table.tenantId, table.createdAt)]);
