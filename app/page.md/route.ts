import { verseStudyEntries } from "../content";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const surah = Number(url.searchParams.get("surah") ?? 0);
  const entries = surah > 0 ? verseStudyEntries.filter(([key]) => key.startsWith(`${surah}:`)) : verseStudyEntries;
  const body = ["# Âyet Atlası — Temiz içerik görünümü", "", "> Dilsel katman, belge okuması ve sembolik hipotez birbirinden ayrılır.", "", ...entries.flatMap(([key, study]) => [`## ${key}`, "", `**Kaynak dayanağı:** ${study.sourceBasis}`, "", `### Lafız odağı\n${study.literalFocus}`, "", `### Kök ve dil\n${study.rootLanguage}`, "", `### Bağlam\n${study.context}`, "", `### Belge okuması\n${study.documentReading}`, "", `### Sembolik hipotez\n${study.symbolicHypothesis}`, "", `### Tefekkür\n${study.reflection}`, ""])].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
}
