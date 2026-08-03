import { aliImranBatch } from "./ali-imran-batch";
import { aliImran21to40 } from "./ali-imran-21-40";
import { maideBatch } from "./maide-batch";
import { maide6to20 } from "./maide-6-20";
import { nisaBatch } from "./nisa-batch";
import { nisa6to20 } from "./nisa-6-20";
import { bakara1to40 } from "./bakara-1-40";
import { enam1to30 } from "./enam-1-30";
import { araf1to20 } from "./araf-1-20";
import { yunus1to30 } from "./yunus-1-30";
import { hud1to20 } from "./hud-1-20";
import type { VerseStudy } from "./types";

export const verseStudies: Record<string, VerseStudy> = {
  ...bakara1to40,
  ...aliImranBatch,
  ...aliImran21to40,
  ...nisaBatch,
  ...nisa6to20,
  ...maideBatch,
  ...maide6to20,
  ...enam1to30,
  ...araf1to20,
  ...yunus1to30,
  ...hud1to20,
};

export const verseStudyEntries = Object.entries(verseStudies).sort(([a], [b]) => {
  const [as, aa] = a.split(":").map(Number);
  const [bs, ba] = b.split(":").map(Number);
  return as - bs || aa - ba;
});
