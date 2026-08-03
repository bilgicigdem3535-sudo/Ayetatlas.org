# Felaket kurtarma çalışma planı

Bu belge bir kurtarma hazırlığı kontrol listesidir; tek başına gerçek bölgesel failover garantisi değildir.

## Hedefler

- Kamuya açık okuma sayfaları için hedef RTO: 60 dakika.
- İçerik verisi için hedef RPO: son doğrulanmış D1 yedeği veya dışa aktarımı.
- Kaynak kodunun geri dönüş kaynağı: korumalı `main` dalı ve son başarılı yayın etiketi.

## Aylık tatbikat

1. Temiz bir ortamda kilitli bağımlılıklarla kurulum yapılır.
2. güvenlik taraması, lint, unit/integration testleri, üretim derlemesi ve performans bütçesi çalıştırılır.
3. D1 migration dosyalarının ve barındırma tanımının varlığı doğrulanır.
4. Kurtarma paketi yalnızca GitHub Actions artifact deposuna 30 gün süreyle yazılır.
5. Başarısız iş akışı operasyon olayı olarak incelenir; gerçek veri geri yükleme tatbikatı ayrıca kayıt altına alınır.

## Gerçek olay sırası

1. Yazma uçlarını bakım moduna al ve olay zamanını kaydet.
2. Son sağlam kod sürümünü yeni ortama dağıt.
3. D1 yedeğini veya dışa aktarımını geri yükle, migration durumunu doğrula.
4. R2 belge nesnelerinin örnek hash ve erişim kontrollerini yap.
5. `/livez`, `/readyz`, `/healthz`, ana okuma ve blog yükleme akışlarını test et.
6. Trafiği kademeli aç; hata oranı yükselirse önceki sağlam sürüme dön.

Gerçek platform yedekleme sıklığı, saklama süresi ve bölgesel geri yükleme prosedürü barındırma sağlayıcısında ayrıca yapılandırılmalı ve kanıtlanmalıdır.
