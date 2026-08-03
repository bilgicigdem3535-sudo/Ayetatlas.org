# AI ve dayanıklılık katmanı

## Uygulanan parçalar

- `Accept: text/markdown` isteyen istemciler ana sayfanın aynı içeriğe dayalı hafif Markdown görünümünü alır. Kullanıcı aracısına göre farklı anlam veya metin sunulmaz.
- Kamuya açık ağır okuma uçları single-flight ile aynı anda gelen eş istekleri tek kaynak isteğinde birleştirir.
- Son başarılı yanıt edge önbelleğinde tutulur; kaynak hata verirse `Warning` ve `X-Cache-Fallback: stale-if-error` işaretiyle sunulur.
- `DEGRADED_MODE=1` acil durum anahtarı analitik, RUM ve Web Vitals yazmalarını kapatırken Kur’an okuma hizmetini açık tutar.
- `SHADOW_ORIGIN` boşken gölge trafik tamamen kapalıdır. Açılırsa yalnız `/api/content` yolunun yaklaşık yüzde biri, çerez/IP/query/header taşınmadan salt-okunur hedefe gönderilir; gölge yanıt kullanıcıya dönmez.
- Her yanıta görünür politika sayfasına işaret eden kaynak-provenans başlığı eklenir.

## Semantik önbellek hazırlığı

Mevcut sitede canlı bir LLM sohbet uç noktası olmadığı için sahte bir “%90 benzerlik” önbelleği çalışıyor gibi gösterilmez. Sohbet servisi eklendiğinde önbellek anahtarı şu alanları içermelidir: normalize soru, dil, model ailesi, prompt sürümü, içerik sürümü ve güvenlik politikası sürümü. Benzerlik eşiği tek başına yeterli değildir; ayet referansları ve kaynak sürümü de birebir doğrulanmalıdır.

## İçerik izi

Zero-width karakterler Arapça metni, kopyalamayı, aramayı ve ekran okuyucuları bozabileceği için kullanılmaz. Bunun yerine yayın sürümü, canonical URL, kaynak açıklaması ve ileride imzalı içerik özeti kullanılmalıdır.
