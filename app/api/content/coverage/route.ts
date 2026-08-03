import { verseStudyEntries } from "../../../content";
import { surahs } from "../../../surahs";

export const runtime = "edge";

export function GET() {
  const counts = new Map<number, number>();
  for (const [key] of verseStudyEntries) {
    const surahNo = Number(key.split(":")[0]);
    counts.set(surahNo, (counts.get(surahNo) ?? 0) + 1);
  }
  const items = surahs.map((surah) => {
    const completed = counts.get(surah.no) ?? 0;
    return { surahNo: surah.no, name: surah.name, total: surah.count, completed, missing: surah.count - completed, percent: Math.round((completed / surah.count) * 1000) / 10 };
  });
  const completed = items.reduce((sum, item) => sum + item.completed, 0);
  const total = items.reduce((sum, item) => sum + item.total, 0);
  return Response.json({ schemaVersion: 1, completed, total, missing: total - completed, percent: Math.round((completed / total) * 1000) / 10, surahs: items }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" } });
}
