"use client";

import { useMemo, useState } from "react";
import { surahs } from "./surahs";

const layers = [
  {
    id: "lafiz",
    label: "Lafız",
    eyebrow: "METNİN YÜZEYİ",
    title: "Bir düzenin içinde saf tutmak",
    text: "Âyet, dizilişi yalnız biçim olarak değil; amaç, yön ve disiplin bakımından bir araya gelişi de düşündürür. Yemin üslubu dikkati bu sahneye toplar.",
  },
  {
    id: "kok",
    label: "Kök & Dil",
    eyebrow: "ص ف ف · Ṣ–F–F",
    title: "Yan yana gelmek, sıra oluşturmak",
    text: "Kök; saf, sıra ve düzen fikrini taşır. ‘Sâffât’ dişil çoğul ism-i fâildir: saf saf duranlar veya düzen kuranlar. ‘Ṣaffan’ ise eylemin biçimini güçlendirir.",
  },
  {
    id: "baglam",
    label: "Bağlam",
    eyebrow: "37:1–5 · AÇILIŞ DİZİSİ",
    title: "Hiza → engeli giderme → zikri taşıma",
    text: "İlk üç âyette art arda gelen hareketler, sûrenin tevhid ilanına hazırlık kurar. Dizilim; kozmik düzeni, görevi ve mesajın aktarılışını tek ritimde buluşturur.",
  },
  {
    id: "hakikat",
    label: "Hakikat-ötesi",
    eyebrow: "SEMBOLİK OKUMA",
    title: "İç çokluğu tek niyette hizalamak",
    text: "Belge yaklaşımınızla bu âyet bir ‘hiza kapısı’ olarak okunabilir: düşünce, duygu ve eylemin aynı yöne bakması. Bu bölüm kişisel tefekkür önerisidir; tefsir veya kesin dinî hüküm değildir.",
  },
];

const words = [
  { ar: "وَ", tr: "ve / andolsun", note: "Bağlar, akışı açar" },
  { ar: "الصَّافَّاتِ", tr: "saf saf dizilenler", note: "ص ف ف · düzen, sıra" },
  { ar: "صَفًّا", tr: "sıra sıra", note: "Mutlak mef‘ûl · pekiştirme" },
];

export default function Home() {
  const [activeLayer, setActiveLayer] = useState("lafiz");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(37);
  const [saved, setSaved] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const selectedSurah = surahs.find((s) => s.no === selected) ?? surahs[3];
  const layer = layers.find((item) => item.id === activeLayer) ?? layers[0];
  const filtered = useMemo(
    () => surahs.filter((s) => `${s.name} ${s.no}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))),
    [query],
  );

  return (
    <main className="app-shell">
      <header className="topbar glass">
        <button className="mobile-menu" onClick={() => setNavOpen(!navOpen)} aria-label="Sûre menüsünü aç">☰</button>
        <a className="brand" href="#top" aria-label="Âyet Atlası ana sayfa">
          <span className="brand-glyph">ن</span>
          <span><b>Âyet Atlası</b><small>Katmanlı Kur’an Araştırması</small></span>
        </a>
        <label className="global-search">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sûre, âyet, kelime veya kök ara…" aria-label="Kur'an içinde ara" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="header-actions">
          <button className="icon-button" aria-label="Görünüm ayarları">◐</button>
          <button className="profile" aria-label="Profil">Ç</button>
        </div>
      </header>

      <aside className={`sidebar glass ${navOpen ? "open" : ""}`}>
        <div className="side-heading"><span>SÛRELER</span><small>114</small></div>
        <div className="mini-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sûre ara" /></div>
        <nav className="surah-list" aria-label="Sûreler">
          {filtered.map((surah) => (
            <button key={surah.no} className={selected === surah.no ? "surah active" : "surah"} onClick={() => { setSelected(surah.no); setNavOpen(false); }}>
              <span className="surah-no">{String(surah.no).padStart(3, "0")}</span>
              <span className="surah-copy"><b>{surah.name}</b><small>{surah.count} âyet · {surah.mark}</small></span>
              <span className="surah-dot" title={surah.mark}></span>
            </button>
          ))}
        </nav>
        <div className="library-note">
          <span className="spark">✦</span>
          <div><b>İnceleme Kütüphanesi</b><small>Word çalışmalarınızdan türetilen özgün katmanlar</small></div>
        </div>
      </aside>

      <section className="reader" id="top">
        <div className="reader-heading">
          <div>
            <span className="crumb">KUR’AN <i>›</i> {selectedSurah.name.toUpperCase()}</span>
            <h1>{selectedSurah.name} <em>{selectedSurah.no}</em></h1>
          </div>
          <div className="verse-nav"><button aria-label="Önceki âyet">‹</button><span>Âyet <b>1</b> / {selectedSurah.count}</span><button aria-label="Sonraki âyet">›</button></div>
        </div>

        {selected === 37 ? <article className="verse-card glass">
          <div className="verse-orbit"><span>1</span></div>
          <button className={saved ? "save saved" : "save"} onClick={() => setSaved(!saved)} aria-label="Âyeti kaydet">{saved ? "◆" : "◇"}</button>
          <p className="arabic" lang="ar" dir="rtl">وَالصَّافَّاتِ صَفًّا</p>
          <p className="transliteration">Ve’s-sâffâti saffâ</p>
          <div className="translation"><span>ANLAM</span><p>Saf saf dizilenlere andolsun.</p></div>
          <div className="verse-tools"><button>▶ <span>Dinle</span></button><button>◌ <span>Kelime kelime</span></button><button>↗ <span>Paylaş</span></button></div>
        </article> : <article className="coverage-card glass">
          <span className="coverage-no">{String(selectedSurah.no).padStart(3, "0")}</span>
          <span className="eyebrow">114 SÛRELİK TAM ATLAS</span>
          <h2>{selectedSurah.name} sûresi katalogda</h2>
          <p>{selectedSurah.count} âyetin tamamı; lafız, kök, harf, bağlam ve sembolik tefekkür şemasına bağlanmak üzere aynı araştırma omurgasında yer alıyor.</p>
          <div className="coverage-flow"><span>Lafız</span><i>→</i><span>Kök</span><i>→</i><span>Bağlam</span><i>→</i><span>Tefekkür</span></div>
          <button onClick={() => setSelected(37)}>Tamamlanmış örneği aç · Sâffât 1</button>
        </article>}

        {selected === 37 && <section className="word-section">
          <div className="section-title"><span>KELİME ATLASI</span><small>Bir kelimeye dokunarak kök katmanını aç</small></div>
          <div className="word-grid">
            {words.map((word, i) => <button className="word-card" key={word.ar}><small>{String(i + 1).padStart(2, "0")}</small><strong lang="ar">{word.ar}</strong><b>{word.tr}</b><span>{word.note}</span></button>)}
          </div>
        </section>}

        <div className="progress-track"><i></i></div>
        <p className="reading-position">{selectedSurah.name.toUpperCase()} · 1 / {selectedSurah.count}</p>
      </section>

      <aside className="insight-panel">
        <div className="panel-head"><div><span>ÇOK KATMANLI İNCELEME</span><h2>Âyetin derinliği</h2></div><button aria-label="Panel seçenekleri">•••</button></div>
        <div className="layer-tabs" role="tablist">
          {layers.map((item) => <button key={item.id} role="tab" aria-selected={activeLayer === item.id} className={activeLayer === item.id ? "active" : ""} onClick={() => setActiveLayer(item.id)}>{item.label}</button>)}
        </div>
        <div className="layer-content" key={layer.id}>
          <span className="eyebrow">{layer.eyebrow}</span>
          <h3>{layer.title}</h3>
          <p>{layer.text}</p>
          <div className="quote-line"><i></i><p>“Hiza, benzer olmak değil; ayrı parçaların aynı hakikate yönelmesidir.”</p></div>
        </div>
        <div className="reflection glass">
          <div className="reflection-title"><span>◉</span><div><small>ŞİMDİ & BURADA</small><b>İç gözlem</b></div></div>
          <p>Bugün düşüncem, sözüm ve eylemim hangi konuda aynı safta durmuyor?</p>
          <textarea aria-label="Tefekkür notu" placeholder="İlk gelen cümleyi yargılamadan yaz…"></textarea>
          <button className="note-button">Notlarıma ekle <span>＋</span></button>
        </div>
        <p className="method-note"><b>Yöntem notu</b> · Dil ve bağlam katmanları kaynaklandırılmalı; “hakikat-ötesi” bölümü ise sembolik/kişisel tefekkür olarak sunulur.</p>
      </aside>

      {navOpen && <button className="scrim" onClick={() => setNavOpen(false)} aria-label="Menüyü kapat" />}
    </main>
  );
}
