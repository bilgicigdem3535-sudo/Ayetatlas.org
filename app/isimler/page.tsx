import Link from "next/link";
import { quranNames } from "../research-data";
export const metadata = { title: "Kur’an’da Geçen İsimler · Âyet Atlası" };
export default function NamesPage() { return <main className="index-page" id="main-content"><Link href="/tr">← Âyet Atlası</Link><header><span>VARLIK VE ŞAHIS DİZİNİ</span><h1>Kur’an’da geçen isimler</h1><p>İsimler bir sıklık yarışması olarak değil, Kur’an anlatısındaki temel görev ve temalarıyla sunulur. Ayrıntılı âyet bağlantıları yalnız doğrulanmış veri geldikçe açılır.</p></header><section className="index-grid name-grid">{quranNames.map(([name, theme]) => <article key={name}><h2>{name}</h2><p>{theme}</p></article>)}</section></main>; }
