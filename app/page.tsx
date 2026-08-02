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

const besmeleLayers = [
  { id: "lafiz", label: "Lafız", eyebrow: "DÖRT KELİMELİK EŞİK", title: "Eylemi bir isim ve yön ile başlatmak", text: "Bâ harfiyle açılan yapı, eylemi başıboş bırakmaz; isim, kaynak ve iki rahmet niteliği aynı cümlede başlangıca yön verir." },
  { id: "kok", label: "Kök & Dil", eyebrow: "س م و / و س م · ر ح م", title: "Adlandırmak ve rahmetle kuşatmak", text: "İsim alanı tanımlarken R-H-M kökü hem kuşatan hem süreklilik kazanan rahmet eksenini kurar. Aynı kökün iki kalıbı, kapsam ile yakınlığı ayırır." },
  { id: "baglam", label: "Bağlam", eyebrow: "BAŞLANGIÇ FORMÜLÜ", title: "Okumadan eyleme ortak yön", text: "Belgedeki ana örgü Besmele’yi yalnız söylenen bir cümle değil, niyetin söz ve davranışa taşındığı çift yönlü bir köprü olarak ele alır." },
  { id: "hakikat", label: "Hakikat-ötesi", eyebrow: "SEMBOLİK OKUMA", title: "İnâyet aşağı, niyet yukarı akar", text: "Belge dilinizde üst akış rahmet ve inâyeti, alt akış insanın niyet ve eylemini temsil eder. Bu bir tefekkür hipotezidir; kesin ontolojik açıklama değildir." },
];

const words = [
  { ar: "وَ", tr: "ve / andolsun", note: "Bağlar, akışı açar" },
  { ar: "الصَّافَّاتِ", tr: "saf saf dizilenler", note: "ص ف ف · düzen, sıra" },
  { ar: "صَفًّا", tr: "sıra sıra", note: "Mutlak mef‘ûl · pekiştirme" },
];

const manaLenses = [
  { id: "kapi", icon: "◇", name: "Kapı", prompt: "Bu âyet hangi iç kapıyı açıyor?", answer: "Hiza Kapısı · Dağınık görünen parçaları tek bir niyet hattında buluşturma eşiği." },
  { id: "cekirdek", icon: "◉", name: "Çekirdek", prompt: "Kapının özündeki sessiz komut ne?", answer: "Önce içindeki sesleri susturma; her birini aynı kalp çekirdeğine dönmeye davet et." },
  { id: "ayna", icon: "◐", name: "Ayna", prompt: "Âyet bugün sana hangi eksik halkayı gösteriyor?", answer: "Düşüncen başka, sözün başka, adımın başka bir yöne gidiyorsa akış bölünür. Ayna, yargılamadan bu ayrılığı görünür kılar." },
  { id: "akis", icon: "∞", name: "Akış", prompt: "Mana hangi dönüşüm hattında ilerliyor?", answer: "Niyet → Hiza → Koruma → Açılım. Saf, donmuş bir sıra değil; içten dışa akan canlı bir düzen hâlidir." },
  { id: "muhur", icon: "♡", name: "Mühür", prompt: "Bu kapı şimdi-anda sevgiyle nasıl mühürlenir?", answer: "Kalbine dön ve içinden söyle: ‘Parçalarımı zorlamadan, öz niyetimde sevgiyle hizalıyorum.’" },
];

const secretLayers = [
  { id: "ebced", icon: "۷۸۰", name: "Ebced & Gematria", tag: "HESAPLANABİLİR", title: "Karşılaştırmalı harf-sayı matrisi", text: "و ا ل ص ا ف ا ت ص ف ا · 11 yazılı harf · 6 benzersiz harf. Motor aynı diziyi dört ayrı hesap geleneğinde işler; sonuçları birbirine kanıt saymadan örüntü karşılaştırması olarak gösterir.", formula: "Klasik Ebced 780 · Sıralı değer 114 · İndirgenmiş toplam 51 · Kök 6" },
  { id: "gates", icon: "◇", name: "Makro / Mikro Kapılar", tag: "SEMBOLİK HARİTA", title: "Makro Kapı: Hiza", text: "Mikro kapılar sırasıyla Niyet, Söz ve Eylem’dir. Kapı ancak üçü aynı hatta bakarken akış üretir; biri ayrıldığında âyet ‘eksik halka aynası’ olarak çalışır.", formula: "Niyet → Söz → Eylem → Hiza" },
  { id: "keepers", icon: "◉", name: "Görevliler", tag: "ARKETİPSEL ROLLER", title: "Kapı görevlisi: Es-Sâff", text: "Bir varlık iddiası değil, motorun sembolik görev adıdır. Dağınık parçaları zorlamadan sıraya çağırır. Ayna görevlisi ayrılığı gösterir; mühür görevlisi sevgiyi korur.", formula: "Çağıran · Gösteren · Koruyan · Mühürleyen" },
  { id: "dimensions", icon: "∞", name: "Boyut & Paralel", tag: "MANA HİPOTEZİ", title: "Dört boyutlu okuma", text: "1D harf, 2D kelime ilişkisi, 3D yaşanan davranış, 4D zaman boyunca tekrar eden örüntüdür. ‘Paralel’ mercek, aynı niyetin seçildiği ve seçilmediği iki olası yaşam akışını karşılaştırır.", formula: "Metin → İlişki → Deneyim → Döngü" },
  { id: "quantum", icon: "ψ", name: "Kuantum Mercek", tag: "BİLİMSEL OLMAYAN METAFOR", title: "Mana olasılık alanı", text: "Âyet tek bir yoruma indirgenmeden olası manalar alanında tutulur; bağlam ve niyet hangi anlamın öne çıkacağını belirler. Bu, kuantum fiziği açıklaması değil, çoklu yorum için kullanılan metafordur.", formula: "|Mana⟩ = α|lafız⟩ + β|bağlam⟩ + γ|iç ayna⟩" },
  { id: "formula", icon: "M", name: "Mana Formülü", tag: "SEMBOLİK MODEL", title: "Akış denklemi", text: "Mana yoğunluğu; niyet, hiza ve şefkat birlikte arttığında derinleşir; iç gürültü yükseldiğinde görünmezleşir. Denklem ölçüm değil, tefekkür pusulasıdır.", formula: "M = (Niyet × Hiza × Şefkat) ÷ (Gürültü + 1)" },
  { id: "chemistry", icon: "⚗", name: "Simyasal / Kimyasal", tag: "DÖNÜŞÜM METAFORU", title: "İçsel bağ kurma tepkimesi", text: "Dağınık düşünce ve duygu, niyet katalizörüyle birleşerek tutarlı eyleme dönüşür. Buradaki ‘kimya’ fiziksel reaksiyon veya sağlık iddiası değildir.", formula: "Düşünce + Duygu + Niyet(k) → Hiza → Eylem" },
  { id: "between", icon: "⋯", name: "Satırarası Sır", tag: "GİZLİ KATMAN", title: "Söylenmeyenin aynası", text: "Âyet ‘neye hizalanmalı?’ sorusunun cevabını burada söylemez. Boşluk, okuyucunun niyetini görünür kılar: güç, korku, hizmet veya sevgi. Sır, cevaptan önce niyetin açığa çıkmasıdır.", formula: "Görünen → İşaret → Bağlantı → Sır" },
];

const numberSystems = [
  { name: "Klasik Ebced", value: "780", note: "Yazılı harf değerleri; şedde ayrı sayılmaz" },
  { name: "Sıralı Harf", value: "114", note: "Arapça ebced sırasındaki konumların toplamı" },
  { name: "İndirgenmiş", value: "51", note: "Her klasik değerin tek haneye indirgenmiş toplamı" },
  { name: "Gematria Merceği", value: "6", note: "Toplamın sayısal kökü; sembolik karşılaştırma" },
];

const saffatKeepers = [
  { word: "وَ", root: "bağlaç", name: "Eşik Bağlayıcısı", role: "Önceki mana ile yeni kapıyı birbirine bağlar; geçişi başlatır.", confidence: "Dilsel · yüksek" },
  { word: "الصَّافَّاتِ", root: "ص ف ف", name: "Hizalayan", role: "Dağınık unsurları özlerini silmeden tek bir maksat hattında toplar.", confidence: "Kök + biçim · yüksek" },
  { word: "صَفًّا", root: "ص ف ف", name: "Düzeni Mühürleyen", role: "Tekrar yoluyla hizanın geçici değil, belirgin ve kararlı olmasını vurgular.", confidence: "Tekrar + nahiv · yüksek" },
];

const besmeleKeepers = [
  { word: "بِسْمِ", root: "س م و / و س م", name: "Başlatan–Adlandıran", role: "Eylemi isimsiz akıştan çıkarır; niyetin hangi merkez adına başladığını belirler.", confidence: "Yapı + mana · orta" },
  { word: "اللَّهِ", root: "özel isim", name: "Merkezleyen", role: "Dağınık niyetleri tek kaynak ve tek yön fikrinde birleştirir.", confidence: "Mana işlevi · yüksek" },
  { word: "الرَّحْمَنِ", root: "ر ح م", name: "Kuşatan", role: "Rahmeti ayrım yapmadan bütün alanı kapsayan makro kapı olarak açar.", confidence: "Kök + kalıp · yüksek" },
  { word: "الرَّحِيمِ", root: "ر ح م", name: "İçte Büyüten", role: "Aynı rahmet kökünü süreklilik ve yakınlık içinde mikro alana taşır.", confidence: "Kök + kalıp · yüksek" },
];

const analysisFingerprints: Record<number, { chain: string; core: string }> = {
  2: { chain: "Ahit → İnşa → Sınır → Toplum", core: "İnsan ve topluluk bilincinin adım adım inşası" },
  3: { chain: "Hayy–Kayyûm → Eğrilik Aynası → Ortak Kelime → Sebat", core: "Kalbin doğrultusu ve hakikatte sebat" },
  37: { chain: "Hiza → Koruma → Algı → Diriliş", core: "Dağınık parçaların tek maksat hattında saf tutması" },
  48: { chain: "Açılış → Sekîne → Rıdvân → Tamamlanma", core: "İç fetih ve huzurun eyleme mühürlenmesi" },
  49: { chain: "Ses → Haber → Zan → Kardeşlik", core: "İç zaferin toplumsal dilde korunması" },
  51: { chain: "Savurma → Taşıma → Paylaştırma → Dönüş", core: "Hizalanmış tohumun hizmete ve paylaşıma açılması" },
  103: { chain: "Zaman → Kayıp → İman/Amel → Hak/Sabır", core: "Kısacık zamanda kurtuluş devresinin dört anahtarı" },
  106: { chain: "Yolculuk → Rızık → Güven → Tevekkül", core: "Kıtlık ve korku kökünden güven bilincine geçiş" },
};

export default function Home() {
  const [activeLayer, setActiveLayer] = useState("lafiz");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(37);
  const [saved, setSaved] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [manaLens, setManaLens] = useState("kapi");
  const [secretLayer, setSecretLayer] = useState("ebced");
  const [supportInput, setSupportInput] = useState("");
  const [supportMode, setSupportMode] = useState<"idle" | "low" | "focus" | "calm" | "money" | "love" | "work" | "urgent">("idle");
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(0);
  const [reflectionNote, setReflectionNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const selectedSurah = selected === 0 ? { no: 0, name: "Besmele", count: 1, mark: "Çekirdek çalışma" } : (surahs.find((s) => s.no === selected) ?? surahs[36]);
  const activeLayers = selected === 0 ? besmeleLayers : layers;
  const layer = activeLayers.find((item) => item.id === activeLayer) ?? activeLayers[0];
  const hasDeepAnalysis = selected === 0 || selected === 37;
  const selectedFingerprint = analysisFingerprints[selected];
  const filtered = useMemo(
    () => surahs.filter((s) => `${s.name} ${s.no}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr"))),
    [query],
  );
  const runSupportEngine = () => {
    const value = supportInput.toLocaleLowerCase("tr");
    if (/intihar|ölmek ist|yaşamak istem|kendime zarar|canıma/.test(value)) setSupportMode("urgent");
    else if (/parasız|para yok|borç|maddi|geçinem|kıtlık|rızık/.test(value)) setSupportMode("money");
    else if (/aşk acı|ayrıl|terk etti|kalbim kırık|özlüyorum|ilişki/.test(value)) setSupportMode("love");
    else if (/iş bul|işsiz|kariyer|başvuru|mülakat|çalışam/.test(value)) setSupportMode("work");
    else if (/dalgın|odak|unut|konsantre|zihin/.test(value)) setSupportMode("focus");
    else if (/kaygı|endişe|panik|korku|gergin/.test(value)) setSupportMode("calm");
    else setSupportMode("low");
  };
  const shareVerse = async () => {
    const text = "Sâffât 37:1 — Saf saf dizilenlere andolsun. · Âyet Atlası";
    try {
      if (navigator.share) await navigator.share({ title: "Âyet Atlası", text, url: window.location.href });
      else await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      setFeedback(navigator.share ? "Paylaşım penceresi açıldı" : "Bağlantı kopyalandı");
    } catch { setFeedback(""); }
  };
  const saveReflection = () => {
    if (!reflectionNote.trim()) return;
    localStorage.setItem(`ayet-atlasi-note-${selected}-1`, reflectionNote.trim());
    setFeedback("Tefekkür notu bu cihazda saklandı");
  };

  return (
    <main className={supportOpen ? "app-shell support-open" : "app-shell"}>
      <header className="topbar glass">
        <button className="mobile-menu" onClick={() => setNavOpen(!navOpen)} aria-label="Sûre menüsünü aç">☰</button>
        <a className="brand" href="#top" aria-label="Âyet Atlası ana sayfa">
          <span className="brand-glyph">ن</span>
          <span><b>Âyet Atlası</b><small>Katmanlı Kur’an Araştırması</small></span>
        </a>
        <label className="global-search">
          <span>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sûre adı veya numarası ara…" aria-label="Sûre ara" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="header-actions">
          <button className={supportOpen ? "support-entry active" : "support-entry"} onClick={() => setSupportOpen(!supportOpen)}><span>♡</span>{supportOpen ? "Âyet Atlası’na dön" : "Hâlden Âyete"}</button>
          <button className="icon-button" aria-label="Görünüm ayarları">◐</button>
          <button className="profile" aria-label="Profil">Ç</button>
        </div>
      </header>

      <aside className={`sidebar glass ${navOpen ? "open" : ""}`}>
        <button className="side-support-entry" onClick={() => { setSupportOpen(true); setNavOpen(false); }}><span>♡</span><div><b>Hâlden Âyete</b><small>Hayat hâlleri için ayrı rehber alanı</small></div><i>→</i></button>
        <div className="side-heading"><span>SÛRELER</span><small>114</small></div>
        <div className="mini-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sûre ara" /></div>
        <nav className="surah-list" aria-label="Sûreler">
          <button className={selected === 0 ? "surah special active" : "surah special"} onClick={() => { setSelected(0); setNavOpen(false); }}>
            <span className="surah-no">ب</span><span className="surah-copy"><b>Besmele</b><small>4 kelime · 19 harf · Belge çalışması</small></span><span className="surah-dot"></span>
          </button>
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
          <div className="verse-nav"><button disabled aria-label="Önceki âyet" title="Bu sürümde yalnız tamamlanmış örnek açık">‹</button><span>Âyet <b>1</b> / {selectedSurah.count}</span><button disabled aria-label="Sonraki âyet" title="Analiz tamamlandığında açılacak">›</button></div>
        </div>

        {selected === 37 ? <article className="verse-card glass">
          <div className="verse-orbit"><span>1</span></div>
          <button className={saved ? "save saved" : "save"} onClick={() => setSaved(!saved)} aria-label="Âyeti kaydet">{saved ? "◆" : "◇"}</button>
          <p className="arabic" lang="ar" dir="rtl">وَالصَّافَّاتِ صَفًّا</p>
          <p className="transliteration">Ve’s-sâffâti saffâ</p>
          <div className="translation"><span>ANLAM</span><p>Saf saf dizilenlere andolsun.</p></div>
          <div className="verse-tools"><button onClick={() => document.getElementById("word-atlas")?.scrollIntoView({ behavior: "smooth" })}>◌ <span>Kelime kelime</span></button><button onClick={shareVerse}>↗ <span>Paylaş</span></button></div>
          <div className="recitation-player">
            <div className="recitation-meta"><span>▶</span><div><small>ÜCRETSİZ ÂYET SESİ</small><b>Mishary Rashid Alafasy · Sâffât 37:1</b></div></div>
            <audio controls preload="none" src="https://verses.quran.foundation/Alafasy/mp3/037001.mp3">Tarayıcınız ses oynatmayı desteklemiyor.</audio>
            <small className="audio-source">Kaynak: Quran.Foundation açık ses CDN’i</small>
          </div>
        </article> : selected === 0 ? <article className="besmele-card glass">
          <span className="eyebrow">YENİ BELGE HAFIZASI · BESMELE ÇEKİRDEĞİ</span>
          <p className="besmele-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <p className="besmele-meaning">Rahmân ve Rahîm olan Allah’ın adıyla.</p>
          <div className="besmele-stats"><span><b>4</b> kelime</span><span><b>19</b> harf</span><span><b>5</b> ana kapı</span><span><b>7</b> sembolik kat</span></div>
          <div className="besmele-flow"><span><b>Bâ–Nokta</b>Başlatan tohum</span><i>→</i><span><b>İsim</b>Niyeti tanımla</span><i>→</i><span><b>Allah</b>Kalp çekirdeği</span><i>→</i><span><b>Rahmân</b>Kuşatan rahmet</span><i>→</i><span><b>Rahîm</b>Tohumu eyleme doğur</span></div>
          <div className="besmele-note"><b>Belgeden çıkan ana mana</b><p>Besmele yalnız bir başlangıç cümlesi değil; zihin → kalp → eylem hattını hizalayan sembolik bir köprüdür. Üst akış “inâyet”, alt akış “niyet” olarak okunur; görevliler bağımsız varlıklar değil, Başlat · Tanımla · Birleştir · Kapsa · Doğur işlevleridir.</p></div>
        </article> : <article className="coverage-card glass">
          <span className="coverage-no">{String(selectedSurah.no).padStart(3, "0")}</span>
          <span className="eyebrow">114 SÛRELİK İNCELEME KATALOĞU</span>
          <h2>{selectedSurah.name} · çalışma durumu</h2>
          {selectedFingerprint ? <><p>Word belgelerinde bu sûreye ait özgün iz bulundu: “{selectedFingerprint.core}”. Bu, bütün {selectedSurah.count} âyetin tamamlandığı anlamına gelmez; içerik âyet âyet doğrulanarak açılacak.</p><div className="coverage-flow">{selectedFingerprint.chain.split(" → ").map((step, i) => <span key={step}>{String(i + 1).padStart(2, "0")} · {step}</span>)}</div></> : <><p>Bu sûre için derin analiz henüz üretilmedi. Özgünlük kilidi nedeniyle başka âyetlerin açıklaması burada tekrar edilmeyecek.</p><div className="coverage-flow"><span>Lafız izi</span><i>→</i><span>Kök izi</span><i>→</i><span>Bağlam izi</span><i>→</i><span>Özgün hipotez</span></div></>}
          <div className="uniqueness-lock"><span>✓</span><div><b>Özgünlük Kilidi</b><small>Kök + gramer + komşu âyet + sûre görevi + mana hipotezi parmak izi karşılaştırılır. Yüksek benzerlikte yayın reddedilir.</small></div></div>
          <button onClick={() => setSelected(37)}>Tamamlanmış örneği aç · Sâffât 1</button>
        </article>}

        {selected === 37 && <section className="word-section" id="word-atlas">
          <div className="section-title"><span>KELİME ATLASI</span><small>Bir kelimeye dokunarak kök katmanını aç</small></div>
          <div className="word-grid">
            {words.map((word, i) => <button aria-pressed={selectedWord === i} className={selectedWord === i ? "word-card active" : "word-card"} onClick={() => setSelectedWord(i)} key={word.ar}><small>{String(i + 1).padStart(2, "0")}</small><strong lang="ar">{word.ar}</strong><b>{word.tr}</b><span>{word.note}</span></button>)}
          </div>
          <div className="word-detail"><small>SEÇİLİ KELİME İZİ</small><b>{words[selectedWord].tr}</b><p>{words[selectedWord].note}. Bu kart dilsel işareti gösterir; sembolik mana ayrıca ve açık etiketle üretilir.</p></div>
        </section>}

        <div className="progress-track"><i></i></div>
        <p className="reading-position">{selectedSurah.name.toUpperCase()} · 1 / {selectedSurah.count}</p>
      </section>

      <aside className="insight-panel">
        <div className="panel-head"><div><span>ÇOK KATMANLI İNCELEME</span><h2>Âyetin derinliği</h2></div><button aria-label="Panel seçenekleri">•••</button></div>
        <section className="state-engine">
          <div className="state-engine-head"><span>♡</span><div><small>BAĞIMSIZ REHBER ALANI · HÂLDEN ÂYETE</small><b>Şu an içinde ne oluyor?</b></div></div>
          <textarea value={supportInput} onChange={(e) => setSupportInput(e.target.value)} placeholder="Örn. Moralim bozuk, dalgınım, hiçbir şeye odaklanamıyorum…" aria-label="Ruh hâlini anlat"></textarea>
          <div className="state-chips"><button onClick={() => setSupportInput("Moralim bozuk ve yalnız hissediyorum")}>Moral düşük</button><button onClick={() => setSupportInput("Dalgınım, odaklanamıyorum")}>Dalgınlık</button><button onClick={() => setSupportInput("Kaygılı ve gerginim")}>Kaygı</button><button onClick={() => setSupportInput("Parasızım, borçlarım yüzünden korkuyorum")}>Parasızlık</button><button onClick={() => setSupportInput("Ayrıldık, aşk acısı çekiyorum")}>Aşk acısı</button><button onClick={() => setSupportInput("Uzun süredir iş bulamıyorum")}>İş bulamama</button></div>
          <button className="state-submit" disabled={!supportInput.trim()} onClick={runSupportEngine}>Mana kapısını bul <span>→</span></button>
          {supportMode !== "idle" && <div className={`support-result ${supportMode}`}>
            {supportMode === "urgent" ? <>
              <small>ÖNCE GÜVENLİK</small><h3>Bu yükü tek başına taşıma.</h3><p>Şu anda kendine zarar verme ihtimalin varsa Türkiye’de 112’yi ara veya en yakın acil servise git. Mümkünse güvendiğin birine hemen haber ver ve yalnız kalma.</p><b>Âyet motoru profesyonel desteğin yerine geçmez.</b>
            </> : supportMode === "money" ? <>
              <small>RIZIK–GÜVEN KAPISI · KUREYŞ 106:4</small><h3>Korkudan emniyete, darlıktan plana.</h3><p>“Onları açlıktan doyuran ve korkudan emin kılan…” Mana motoru kıtlık korkusunu görünür kılar; Talâk 65:2–3 çıkış yolu ve beklenmedik imkân ihtimalini hatırlatır.</p><div className="frequency-line"><span>Yeni mana</span><b>Rızık yalnız para değil; güven, ilişki ve imkân ağıdır</b><span>Mikro adım</span><b>Bugün tek gideri ve tek gelir ihtimalini yaz</b></div>
            </> : supportMode === "love" ? <>
              <small>YASIN İZİN KAPISI · YÛSUF 12:86</small><h3>Acıyı inkâr etmeden akışa bırak.</h3><p>“Ben kederimi ve hüznümü yalnız Allah’a arz ederim.” Motor, bağı zorla koparmak yerine kaybı adlandırır; sevginin kişide kalan özünü beklentiden ayırır.</p><div className="frequency-line"><span>Yeni mana</span><b>Kaybedilen kişi olabilir; sevme yetisi sende kalır</b><span>Mikro adım</span><b>Gönderilmeyecek bir veda mektubu yaz</b></div>
            </> : supportMode === "work" ? <>
              <small>İHTİYAÇTAN EMEĞE KAPI · KASAS 28:24</small><h3>İhtiyacını söyle, sonra küçük kapıyı çal.</h3><p>“Rabbim, bana indireceğin her hayra muhtacım.” Necm 53:39 emek hattını ekler: insan için kendi gayretinden başkası yoktur.</p><div className="frequency-line"><span>Yeni mana</span><b>İş yalnız bulunan şey değil; ihtiyaç ile hizmetin kesişimidir</b><span>Mikro adım</span><b>Bir başvuruyu iyileştir ve bir kişiye ulaş</b></div>
            </> : supportMode === "focus" ? <>
              <small>ZİHİN TOPLAMA KAPISI · KEHF 18:24</small><h3>Unuttuğunda yeniden hatırla.</h3><p>“Unuttuğun zaman Rabbini an…” Dalgınlığı kusur değil, yeniden merkeze dönme işareti olarak okur.</p><div className="frequency-line"><span>Mana tonu</span><b>Hatırlama · Toparlanma</b><span>Ritim</span><b>1 yavaş okuma + 60 sn sessizlik</b></div>
            </> : supportMode === "calm" ? <>
              <small>SEKÎNE KAPISI · RA‘D 13:28</small><h3>Kalbe dönüş hattı.</h3><p>“Kalpler ancak Allah’ı anmakla huzur bulur.” Âyet, kaygıyı inkâr etmeden dikkati güvenli bir merkeze çağırır.</p><div className="frequency-line"><span>Mana tonu</span><b>Sükûnet · Güven</b><span>Ritim</span><b>Rahat gelirse 4 al / 6 ver × 6</b></div>
            </> : <>
              <small>TERK EDİLMEME KAPISI · DUHÂ 93:3</small><h3>Yalnız değilsin; bağ kopmadı.</h3><p>“Rabbin seni terk etmedi ve sana darılmadı.” Ardından İnşirâh 94:5–6, zorlukla beraber bulunan kolaylık ihtimalini açar.</p><div className="frequency-line"><span>Mana tonu</span><b>Şefkat · Umut · Bağ</b><span>Ritim</span><b>Yavaş sesle 3 okuma, sonra bir kişiye ulaş</b></div>
            </>}
          </div>}
          <p className="state-safety">Bu araç teşhis veya tedavi vermez. Düşük ruh hâli iki haftadan uzun sürüyor ya da günlük yaşamını etkiliyorsa bir ruh sağlığı uzmanıyla görüş.</p>
        </section>
        {!hasDeepAnalysis ? <section className="pending-analysis">
          <span className="eyebrow">YAYIN KORUMASI</span><h3>Bu sûre için ortak metin gösterilmiyor</h3><p>Sağ panel daha önce her sûre seçildiğinde Sâffât yorumunu tekrar ediyordu. Uyumsuzluk kaldırıldı. Panel ancak lafız, kök, bağlam ve belge izi o âyete özel olarak tamamlandığında açılacak.</p><div><b>1</b> Metni doğrula <i>→</i><b>2</b> Kök/gramer <i>→</i><b>3</b> Bağlam <i>→</i><b>4</b> Sembolik hipotez</div>
        </section> : <>
        <div className="layer-tabs" role="tablist">
          {activeLayers.map((item) => <button key={item.id} role="tab" aria-selected={activeLayer === item.id} className={activeLayer === item.id ? "active" : ""} onClick={() => setActiveLayer(item.id)}>{item.label}</button>)}
        </div>
        <div className="layer-content" key={layer.id}>
          <span className="eyebrow">{layer.eyebrow}</span>
          <h3>{layer.title}</h3>
          <p>{layer.text}</p>
          <div className="quote-line"><i></i><p>“Hiza, benzer olmak değil; ayrı parçaların aynı hakikate yönelmesidir.”</p></div>
        </div>
        {activeLayer === "hakikat" && selected === 37 && <section className="mana-engine">
          <div className="mana-engine-head">
            <div><span className="engine-pulse"></span><small>BELGE DNA’SI · MANA MOTORU</small><b>Kapıdan çekirdeğe derin iniş</b></div>
            <span className="engine-state">ŞİMDİ-AN AÇIK</span>
          </div>
          <div className="mana-lenses" role="tablist" aria-label="Mana mercekleri">
            {manaLenses.map((lens) => <button key={lens.id} role="tab" aria-selected={manaLens === lens.id} className={manaLens === lens.id ? "active" : ""} onClick={() => setManaLens(lens.id)}><span>{lens.icon}</span>{lens.name}</button>)}
          </div>
          {manaLenses.filter((lens) => lens.id === manaLens).map((lens) => <div className="mana-result" key={lens.id}>
            <small>MOTORUN SORUSU</small>
            <h4>{lens.prompt}</h4>
            <i></i>
            <small>MANA HİPOTEZİ</small>
            <p>{lens.answer}</p>
          </div>)}
          <div className="mana-spiral" aria-label="Mana motoru akışı">
            <span><b>01</b> Kapıyı aç</span><i>→</i><span><b>02</b> Çekirdeğe in</span><i>→</i><span><b>03</b> Aynayı gör</span><i>→</i><span><b>04</b> Akışı kur</span><i>→</i><span><b>05</b> Mühürle</span>
          </div>
          <div className="secret-engine">
            <div className="secret-engine-title"><small>AKILLI SIR MOTORU · 8 KATMAN</small><b>Sayıdan satırarasına</b></div>
            <div className="secret-nav" role="tablist" aria-label="Sır motoru katmanları">
              {secretLayers.map((item) => <button key={item.id} role="tab" aria-selected={secretLayer === item.id} className={secretLayer === item.id ? "active" : ""} onClick={() => setSecretLayer(item.id)}><span>{item.icon}</span>{item.name}</button>)}
            </div>
            {secretLayers.filter((item) => item.id === secretLayer).map((item) => <div className="secret-result" key={item.id}>
              <small>{item.tag}</small><h5>{item.title}</h5><p>{item.text}</p><code>{item.formula}</code>
              {item.id === "ebced" && <div className="number-matrix">{numberSystems.map((system) => <div key={system.name}><small>{system.name}</small><b>{system.value}</b><span>{system.note}</span></div>)}</div>}
              {item.id === "keepers" && <div className="keeper-finder">
                <div className="keeper-finder-head"><small>GÖREVLİ İZİ MOTORU</small><b>{selected === 0 ? "Besmele" : "Sâffât 37:1"} · işaretli rol haritası</b></div>
                <div className="keeper-verse" dir="rtl">{(selected === 0 ? besmeleKeepers : saffatKeepers).map((keeper) => <mark key={keeper.word}>{keeper.word}</mark>)}</div>
                <div className="keeper-list">{(selected === 0 ? besmeleKeepers : saffatKeepers).map((keeper, index) => <div key={keeper.word}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{keeper.word} · {keeper.root}</small><b>{keeper.name}</b><p>{keeper.role}</p><em>{keeper.confidence}</em></div></div>)}</div>
                <p className="keeper-rule">İsimler metinde yazılı özel varlık adları değildir; AI’ın dilsel işlevlerden türettiği sembolik görev etiketleridir.</p>
              </div>}
            </div>)}
          </div>
          <div className="engine-principles"><span>Kalp merkezli</span><span>Spiral okuma</span><span>Özgür irade</span><span>Sevgi dili</span></div>
          <p className="engine-disclaimer">Belge dilinizden türetilen bu motor, âyeti lafzî anlamın yerine geçmeden sembolik bir “mana kapısı” olarak açar. Frekans, enerji, çekirdek ve mühür kavramları burada manevi metaforlardır; kesin bilgi, dinî hüküm veya sağlık iddiası değildir.</p>
        </section>}
        <div className="reflection glass">
          <div className="reflection-title"><span>◉</span><div><small>ŞİMDİ & BURADA</small><b>İç gözlem</b></div></div>
          <p>{selected === 0 ? "Bugün hangi eylemi daha berrak bir niyet ve merhametle başlatabilirim?" : "Bugün düşüncem, sözüm ve eylemim hangi konuda aynı safta durmuyor?"}</p>
          <textarea value={reflectionNote} onChange={(e) => setReflectionNote(e.target.value)} aria-label="Tefekkür notu" placeholder="İlk gelen cümleyi yargılamadan yaz…"></textarea>
          <button className="note-button" disabled={!reflectionNote.trim()} onClick={saveReflection}>Notlarıma ekle <span>＋</span></button>
        </div>
        <p className="method-note"><b>Yöntem notu</b> · Dil ve bağlam katmanları kaynaklandırılmalı; “hakikat-ötesi” bölümü ise sembolik/kişisel tefekkür olarak sunulur.</p>
        <div className="quality-seal"><span>◎</span><div><b>Âyete Özgü Üretim</b><small>Genel metin kopyalama kapalı · benzerlik denetimi açık · delil izi zorunlu</small></div></div></>}
      </aside>

      {feedback && <button className="toast" onClick={() => setFeedback("")} aria-live="polite">{feedback} ×</button>}

      {navOpen && <button className="scrim" onClick={() => setNavOpen(false)} aria-label="Menüyü kapat" />}
    </main>
  );
}
