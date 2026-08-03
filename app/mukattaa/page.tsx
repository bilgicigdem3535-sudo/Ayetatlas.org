import Link from "next/link";
import { muqattaaGroups } from "../research-data";
export const metadata = { title: "Hurûf-ı Mukattaa · Âyet Atlası" };
export default function MuqattaaPage() { return <main className="index-page" id="main-content"><Link href="/tr">← Âyet Atlası</Link><header><span>29 SÛRE · 14 HARF GRUBU</span><h1>Hurûf-ı Mukattaa</h1><p>Kesik harfler burada sûre dağılımıyla gösterilir. Kesin sözlük anlamı veya gizli şifre iddiası kurulmaz; yorumlar açıkça hipotez olarak ayrılmalıdır.</p></header><section className="index-grid muqattaa-grid">{muqattaaGroups.map(([letters, reading, surahs]) => <article key={letters}><b lang="ar" dir="rtl">{letters}</b><h2>{reading}</h2><p>Sûreler: {surahs}</p></article>)}</section></main>; }
