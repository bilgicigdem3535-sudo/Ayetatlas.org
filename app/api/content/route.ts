import { verseStudyEntries } from "../../content";
import { surahs } from "../../surahs";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedSurah = Number(url.searchParams.get("surah") ?? 0);
  const requestedAyah = Number(url.searchParams.get("ayah") ?? 0);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
  const cursor = Math.max(0, Number(url.searchParams.get("cursor") ?? 0));
  const filtered = verseStudyEntries.filter(([key]) => {
    const [surahNo, ayahNo] = key.split(":").map(Number);
    return (!requestedSurah || surahNo === requestedSurah) && (!requestedAyah || ayahNo === requestedAyah);
  });
  const items = filtered.slice(cursor, cursor + limit).map(([key, study]) => {
    const [surahNo, ayahNo] = key.split(":").map(Number);
    return {
      id: `quran:${key}:tr-study-v1`,
      type: "VerseStudy",
      canonical: `https://ayetatlas.org/api/content?surah=${surahNo}&ayah=${ayahNo}`,
      inLanguage: "tr",
      about: { surahNo, surahName: surahs.find((item) => item.no === surahNo)?.name, ayahNo },
      provenance: { method: "Arapça lafız ve bağlam temelinde, kullanıcı Word belgelerinin yöntem diliyle hazırlanmış katmanlı çalışma", contentClasses: ["dilsel-veri", "belge-okuması", "sembolik-hipotez"] },
      study,
    };
  });
  if (url.searchParams.get("format") === "jsonld") {
    return Response.json({
      "@context": "https://schema.org",
      "@graph": items.map((item) => ({
        "@type": "TechArticle",
        "@id": item.canonical,
        headline: `${item.about.surahName} ${item.about.ayahNo}. âyet katmanlı çalışma`,
        inLanguage: item.inLanguage,
        about: { "@type": "Book", name: "Kur’an-ı Kerim", sameAs: "https://www.wikidata.org/wiki/Q428" },
        isPartOf: { "@id": "https://ayetatlas.org/#verse-studies" },
        publisher: { "@id": "https://ayetatlas.org/#organization" },
        citation: { "@type": "CreativeWork", description: item.provenance.method },
        articleBody: [item.study.literalFocus, item.study.rootLanguage, item.study.context, item.study.documentReading, item.study.symbolicHypothesis].join("\n\n"),
      })),
    }, { headers: { "Content-Type": "application/ld+json; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=3600" } });
  }
  return Response.json({ schemaVersion: "1.0", total: filtered.length, cursor, nextCursor: cursor + items.length < filtered.length ? cursor + items.length : null, items }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400" } });
}
