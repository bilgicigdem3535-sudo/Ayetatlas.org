import { verseStudyEntries } from "../content";

export const runtime = "edge";

export async function GET() {
  const lines = ["# Âyet Atlası — LLM tam içerik indeksi", "", "Canonical: https://ayetatlas.org/", "JSON API: https://ayetatlas.org/api/content", "Embedding chunks: https://ayetatlas.org/api/content/chunks", "Markdown: https://ayetatlas.org/page.md", "", "## İçerik sözleşmesi", "", "Lafız/kök/bağlam dilsel inceleme; belge okuması yöntem aktarımı; sembolik hipotez kesin hüküm değildir.", "", ...verseStudyEntries.flatMap(([key, item]) => [`## ${key}`, `- Kaynak: ${item.sourceBasis}`, `- Lafız: ${item.literalFocus}`, `- Kök/dil: ${item.rootLanguage}`, `- Bağlam: ${item.context}`, `- Belge okuması: ${item.documentReading}`, `- Sembolik hipotez: ${item.symbolicHypothesis}`, `- Tefekkür: ${item.reflection}`, ""] )];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
