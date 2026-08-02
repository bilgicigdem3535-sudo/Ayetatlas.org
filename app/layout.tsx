import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Âyet Atlası — Katmanlı Kur’an Araştırması",
  description: "Kur’an âyetlerini lafız, kök, bağlam ve sembolik tefekkür katmanlarında keşfedin.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  metadataBase: new URL("https://ayetatlas.org"),
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "tr_TR", siteName: "Âyet Atlası", title: "Âyet Atlası", description: "Arapça mushaf metni ve belgeye dayalı katmanlı Kur’an araştırması." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = { "@context": "https://schema.org", "@type": "WebSite", name: "Âyet Atlası", url: "https://ayetatlas.org", inLanguage: ["tr", "ar"], description: "Arapça mushaf metni ve belgeye dayalı katmanlı Kur’an araştırması." };
  return <html lang="tr"><body className={`${geistSans.variable} ${geistMono.variable}`}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />{children}</body></html>;
}
