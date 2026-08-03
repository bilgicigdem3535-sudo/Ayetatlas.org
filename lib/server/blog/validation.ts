import { z } from "zod";

export const blogUploadSchema = z.object({
  title: z.string().trim().min(1).max(160),
  excerpt: z.string().trim().max(600),
  authorName: z.string().trim().min(1).max(80),
  surahNo: z.coerce.number().int().min(1).max(114),
  surahName: z.string().trim().min(1).max(80),
  idempotencyKey: z.string().uuid(),
});

export type BlogUploadInput = z.infer<typeof blogUploadSchema>;
