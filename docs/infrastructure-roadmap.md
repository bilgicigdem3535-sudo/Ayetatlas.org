# Âyet Atlası görünmeyen omurga haritası

Bu belge, altyapı maddelerini `aktif`, `kısmi`, `platform ayarı` ve `planlandı` durumlarıyla izler. Kanıtlanmamış bir özellik tamamlandı sayılmaz.

## Altyapı, CDN ve Edge

| # | Mimari yetenek | Durum | Uygulama / sonraki kanıt |
|---|---|---|---|
| 1 | Edge Server Rendering | Aktif | Vinext çıktısı Cloudflare Worker üzerinde çalışıyor. |
| 2 | Multi-region Anycast | Platform ayarı | Cloudflare ağı tarafından sağlanır; bölgesel gecikme ölçümü eklenecek. |
| 3 | HTTP/3 ve QUIC | Platform ayarı | Alan adı üzerinden `alt-svc` ve protokol testiyle doğrulanacak. |
| 4 | DNS optimizasyonu ve DNSSEC | Platform ayarı | Cloudflare DNS panelinde DNSSEC etkinliği ayrıca doğrulanacak. |
| 5 | Cache-Control ve SWR | Kısmi | Statik varlıklar immutable; Kur’an API yanıtları edge cache kullanıyor. HTML/SWR matrisi genişletilecek. |
| 6 | Hibrit rendering | Kısmi | Ana kabuk ve dinamik API ayrıldı; sûre/âyet kalıcı URL’leri geldiğinde SSG/ISR katmanı eklenecek. |
| 7 | Reverse proxy ve yük dengeleme | Aktif | Origin, Cloudflare Worker/Sites arkasında. Özel mikroservis origin’i henüz yok. |
| 8 | Brotli/Gzip | Platform ayarı | Cloudflare içerik kodlaması üzerinden yanıt başlığıyla doğrulanacak. |
| 9 | Origin shielding | Kısmi | Uygulama Worker arkasında; gelecekteki haricî origin’ler yalnız servis bağlarıyla açılacak. |
| 10 | Dinamik varlık optimizasyonu | Aktif | Vinext image endpoint’i Cloudflare Images dönüşümünü kullanıyor. |
| 11 | TLS 1.3 ve HSTS | Kısmi | HSTS uygulama yanıtlarında aktif; minimum TLS sürümü panelden doğrulanacak. |
| 12 | ESI / mikro-frontends | Planlandı | Şu an tek uygulama daha güvenli ve basit; bağımsız servis sınırı oluşmadan parçalanmayacak. |

## Bu sürümde aktif omurga

- Merkezi güvenlik başlıkları ve içerik güvenlik politikası
- HSTS, clickjacking, MIME sniffing ve gereksiz tarayıcı izinlerini kapatma
- `/api/health` edge sağlık ucu ve `Server-Timing`
- Statik varlıklarda uzun süreli immutable cache
- Kur’an metni API’sinde kaynak kimliği, sûre ve âyet doğrulaması
- Blog yüklemesinde origin, dosya türü ve istek boyutu denetimi
- `robots.txt`, `sitemap.xml`, `llms.txt`, web manifest ve Schema.org WebSite verisi
- Kullanıcı dostu hata sınırı
- Âyet içerikleri için tür güvenli, sûre bazlı genişletilebilir veri dosyaları

## Sıradaki fazlar

1. Kalıcı sûre/âyet URL’leri ve çok dilli rota düzeni
2. İçerik sürümleme, kaynak izi ve edit geçmişi tabloları
3. Belgeyi PDF sayfalarına dönüştüren dergi okuma hattı
4. Bot ve kullanıcı trafiği için ayrı hız sınırları
5. Gerçek kullanıcı performansı, hata oranı ve haricî kaynak sağlık ölçümleri
6. Yedekleme, geri yükleme, felaket kurtarma ve içerik bütünlük testleri
