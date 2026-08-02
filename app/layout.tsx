import type { Metadata } from "next";
import { Amiri_Quran, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WebVitals from "./web-vitals";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const amiriQuran = Amiri_Quran({ variable: "--font-amiri-quran", subsets: ["arabic"], weight: "400" });

export const metadata: Metadata = {
  title: "Âyet Atlası — Katmanlı Kur’an Araştırması",
  description: "Kur’an âyetlerini lafız, kök, bağlam ve sembolik tefekkür katmanlarında keşfedin.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  metadataBase: new URL("https://ayetatlas.org"),
  alternates: { canonical: "/", languages: { "tr-TR": "/", "x-default": "/" } },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "tr_TR", siteName: "Âyet Atlası", title: "Âyet Atlası", description: "Arapça mushaf metni ve belgeye dayalı katmanlı Kur’an araştırması.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Âyet Atlası — ipek beyazı ve yeşil tonlarında katmanlı Kur’an araştırması" }] },
  twitter: { card: "summary_large_image", title: "Âyet Atlası", description: "Arapça mushaf metni ve belgeye dayalı katmanlı Kur’an araştırması.", images: ["/opengraph-image"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://ayetatlas.org/#organization", name: "Âyet Atlası Yayın Projesi", url: "https://ayetatlas.org/" },
      { "@type": "WebSite", "@id": "https://ayetatlas.org/#website", name: "Âyet Atlası", url: "https://ayetatlas.org/", publisher: { "@id": "https://ayetatlas.org/#organization" }, inLanguage: ["tr", "ar"], about: { "@type": "Book", name: "Kur’an-ı Kerim", sameAs: "https://www.wikidata.org/wiki/Q428" } },
      { "@type": "Dataset", "@id": "https://ayetatlas.org/#verse-studies", name: "Âyet Atlası katmanlı âyet çalışmaları", url: "https://ayetatlas.org/api/content", distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: "https://ayetatlas.org/api/content" }, { "@type": "DataDownload", encodingFormat: "text/markdown", contentUrl: "https://ayetatlas.org/page.md" }], creator: { "@id": "https://ayetatlas.org/#organization" }, inLanguage: "tr", license: "https://ayetatlas.org/" },
      { "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", position: 1, name: "Âyet Atlası", item: "https://ayetatlas.org/" }] },
    ],
  };
  return <html lang="tr"><head><link rel="preconnect" href="https://download.quranicaudio.com" crossOrigin="anonymous" /><link rel="dns-prefetch" href="https://verses.quran.foundation" /><style>{"html{background:#faf8f1}body{margin:0}.app-shell{min-height:100vh}"}</style></head><body className={`${geistSans.variable} ${geistMono.variable} ${amiriQuran.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}<WebVitals /></body></html>;
}
