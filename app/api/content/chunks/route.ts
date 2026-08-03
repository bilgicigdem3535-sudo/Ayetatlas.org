import { verseStudyEntries } from "../../../content";

export const runtime = "edge";

export async function GET() {
  const chunks = verseStudyEntries.map(([key, study]) => ({
    id: `quran:${key}:tr-study-v1`,
    text: [`Lafız odağı: ${study.literalFocus}`, `Kök ve dil: ${study.rootLanguage}`, `Bağlam: ${study.context}`, `Belge okuması: ${study.documentReading}`, `Sembolik hipotez: ${study.symbolicHypothesis}`, `Tefekkür: ${study.reflection}`].join("\n"),
    metadata: { verseKey: key, language: "tr", sourceBasis: study.sourceBasis, contentType: "verse-study", embeddingStatus: "ready" },
  }));
  return Response.json({ schemaVersion: "1.0", embeddingModel: null, dimensions: null, chunks }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
