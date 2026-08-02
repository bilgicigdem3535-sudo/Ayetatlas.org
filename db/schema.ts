import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
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
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
}, (table) => [index("blog_posts_created_at_idx").on(table.createdAt)]);
