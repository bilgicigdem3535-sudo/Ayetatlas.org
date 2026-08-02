import { aliImranBatch } from "./ali-imran-batch";
import { aliImran21to40 } from "./ali-imran-21-40";
import { maideBatch } from "./maide-batch";
import { maide6to20 } from "./maide-6-20";
import { nisaBatch } from "./nisa-batch";
import { nisa6to20 } from "./nisa-6-20";
import type { VerseStudy } from "./types";

export const verseStudies: Record<string, VerseStudy> = {
  ...aliImranBatch,
  ...aliImran21to40,
  ...nisaBatch,
  ...nisa6to20,
  ...maideBatch,
  ...maide6to20,
};

export const verseStudyEntries = Object.entries(verseStudies).sort(([a], [b]) => {
  const [as, aa] = a.split(":").map(Number);
  const [bs, ba] = b.split(":").map(Number);
  return as - bs || aa - ba;
});
