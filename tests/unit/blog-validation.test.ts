import { describe, expect, it } from "vitest";
import { blogUploadSchema } from "../../lib/server/blog/validation";

describe("blog upload boundary", () => {
  const valid = { title: "Âyet çalışması", excerpt: "Kısa özet", authorName: "Yazar", surahNo: "3", surahName: "Âl-i İmrân", idempotencyKey: crypto.randomUUID() };
  it("accepts and coerces a valid request", () => expect(blogUploadSchema.parse(valid).surahNo).toBe(3));
  it("rejects invalid surah numbers", () => expect(blogUploadSchema.safeParse({ ...valid, surahNo: 115 }).success).toBe(false));
  it("rejects a non-UUID idempotency key", () => expect(blogUploadSchema.safeParse({ ...valid, idempotencyKey: "repeat" }).success).toBe(false));
  it("rejects oversized titles", () => expect(blogUploadSchema.safeParse({ ...valid, title: "a".repeat(161) }).success).toBe(false));
});
