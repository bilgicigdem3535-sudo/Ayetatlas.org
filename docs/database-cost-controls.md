# Veritabanı ve maliyet kontrolleri

## Kör indeks

Hesap sistemi ileride e-posta gibi hassas bir alanı uygulama veritabanında saklayacaksa açık değer aranmaz. Değer ayrı bir şifreli sütunda; arama anahtarı ise alan adına göre ayrıştırılmış HMAC-SHA-256 kör indeksinde tutulur. HMAC anahtarı veritabanında değil secret yönetiminde bulunur ve sürümlenir.

Bu projede şu anda T.C. kimlik numarası veya kullanıcı e-postası D1 tablosuna yazılmadığı için gereksiz kişisel veri sütunu ve migration eklenmemiştir. Hazırlanan yardımcı katman ancak gerçek hesap şeması oluşturulduğunda kullanılacaktır. Anahtar rotasyonunda `email_bidx_v1` ve `email_bidx_v2` geçiş dönemi birlikte tutulmalıdır.

## Akış tabanlı dosya aktarımı

Blog yüklemeleri `File.stream()` gövdesini doğrudan R2 `put` işlemine verir; bütün dosya uygulama belleğine alınmaz. Yalnız dosya türü doğrulaması için ilk beş bayt okunur. Edge/R2 ortamında işletim sistemi `sendfile` çağrısını uygulama kodu yönetmez; sağlayıcının nesne depolama ağı bu aktarım katmanını üstlenir.

## Write-behind sınırı

Beğeni/sayaç özelliği henüz bulunmadığı için bellek içi sayaç eklenmemiştir. Worker belleği kalıcı veya küresel değildir; burada “başarılı” deyip sonra yazmak veri kaybına yol açar. Böyle bir özellik eklendiğinde dayanıklı Queue veya Durable Object kabul katmanı, idempotency anahtarı, batch D1 yazımı ve dead-letter kuyruğu birlikte kurulmalıdır.

## Spot sunucu karşılığı

Ayet Atlası yönetilen edge Worker üzerinde çalışır; kullanıcı tarafından yönetilen AWS/GCP sanal makinesi bulunmaz. Bu nedenle Spot termination otomasyonu eklemek maliyeti azaltmaz. Ayrı bir arka plan işleme kümesi kurulursa stateless işçiler Spot üzerinde çalışabilir; D1/R2 ve ana okuma yolu kesintili makinelere bağlanmamalıdır.
