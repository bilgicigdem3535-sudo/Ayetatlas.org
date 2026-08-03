/* eslint-disable @next/next/no-html-link-for-pages */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verseStudies } from "../../../content";
import { surahs } from "../../../surahs";

type Props = { params: Promise<{ surah: string; ayah: string }> };
const resolve = (params: { surah: string; ayah: string }) => {
  const surahNo = Number(params.surah);
  const ayahNo = Number(params.ayah);
  return { surahNo, ayahNo, surah: surahs.find((item) => item.no === surahNo), study: verseStudies[`${surahNo}:${ayahNo}`] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = resolve(await params);
  if (!result.surah || !result.study) return { title: "Sayfa bulunamadı" };
  const path = `/ayet/${result.surahNo}/${result.ayahNo}`;
  return { title: `${result.surah.name} ${result.ayahNo}. âyet · Âyet Atlası`, description: result.study.literalFocus.slice(0, 155), alternates: { canonical: path, languages: { "tr-TR": path, "x-default": path } } };
}

export default async function VersePage({ params }: Props) {
  const result = resolve(await params);
  if (!result.surah || !result.study || result.ayahNo < 1 || result.ayahNo > result.surah.count) notFound();
  let arabic = "";
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${result.surahNo}:${result.ayahNo}/quran-uthmani`, { next: { revalidate: 86400 } });
    const data = await response.json() as { data?: { text?: string } };
    arabic = data.data?.text ?? "";
  } catch { /* The study stays readable if the upstream text source is unavailable. */ }
  const sections = [["Lafız odağı", result.study.literalFocus], ["Kök ve dil", result.study.rootLanguage], ["Bağlam", result.study.context], ["Belge diliyle okuma", result.study.documentReading], ["Sembolik hipotez", result.study.symbolicHypothesis], ["Makro kapı", result.study.macroGate], ["Mikro kapı", result.study.microGate], ["Satır arası mana", result.study.betweenLines]];
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: `${result.surah.name} ${result.ayahNo}. âyet katmanlı inceleme`, inLanguage: ["ar", "tr"], isPartOf: { "@id": "https://ayetatlas.org/#verse-studies" }, about: { "@type": "Book", name: "Kur’an-ı Kerim", sameAs: "https://www.wikidata.org/wiki/Q428" } };
  return <main className="verse-page"><nav aria-label="İçerik yolu"><a href="/">Âyet Atlası</a> / {result.surah.name} / {result.ayahNo}</nav><article><header><p>{result.surah.name} · {result.surahNo}:{result.ayahNo}</p><h1>{result.surah.name} {result.ayahNo}. âyet</h1>{arabic && <p className="arabic" dir="rtl" lang="ar">{arabic}</p>}</header>{sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</article><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></main>;
}
