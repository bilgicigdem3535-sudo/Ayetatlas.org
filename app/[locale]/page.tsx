import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Home from "../page";
import LanguageSwitcher from "../language-switcher";
import { isLocale, locales, type Locale } from "../i18n";

const copy: Record<Exclude<Locale, "tr">, { eyebrow: string; title: string; text: string; enter: string }> = {
  en: { eyebrow: "MULTILINGUAL QURAN RESEARCH", title: "Meaning begins with fidelity to the text.", text: "The Arabic Quran text remains unchanged. Interface and research-layer translations are being released with provenance and human review; unavailable layers currently open in their original Turkish edition.", enter: "Open the Turkish research atlas" },
  de: { eyebrow: "MEHRSPRACHIGE KORANFORSCHUNG", title: "Bedeutung beginnt mit Texttreue.", text: "Der arabische Korantext bleibt unverändert. Übersetzungen der Oberfläche und Forschungsebenen werden mit Quellenangabe und Prüfung veröffentlicht; noch nicht verfügbare Ebenen öffnen in der türkischen Originalfassung.", enter: "Türkischen Forschungsatlas öffnen" },
  ar: { eyebrow: "بحث قرآني متعدد اللغات", title: "يبدأ المعنى من الأمانة للنص.", text: "يبقى النص القرآني العربي دون تغيير. تُنشر ترجمة الواجهة وطبقات البحث مع بيان المصدر والمراجعة، وتُعرض الطبقات غير المتاحة حالياً بصيغتها التركية الأصلية.", enter: "فتح الأطلس البحثي التركي" },
};

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: `Âyet Atlası · ${locale.toUpperCase()}`, alternates: { canonical: `/${locale}`, languages: { tr: "/tr", en: "/en", de: "/de", ar: "/ar", "x-default": "/tr" } } };
}
export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale === "tr") return <Home locale="tr" />;
  const content = copy[locale];
  return <main className="locale-portal" id="main-content" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><LanguageSwitcher locale={locale} /><article><span>{content.eyebrow}</span><h1>{content.title}</h1><p>{content.text}</p><Link href="/tr">{content.enter} →</Link></article></main>;
}
