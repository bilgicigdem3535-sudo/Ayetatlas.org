# Bot savunması

## Uygulanan politika

- Doğrulanmış arama motoru botları Cloudflare bot sinyalinden tanınır ve normal indeksleme akışı korunur.
- Düşük bot puanlı istemciler daha dar istek bütçesine alınır; sınırı aşınca açık `429` ve `Retry-After` alır.
- Robots kurallarını ihlal ederek canary uç noktasına erişen istemci gözlem kaydına alınır. Aynı istemcinin tekrarı 15 dakikalık geçici karantinayı tetikler.
- Loglarda JA4 değerinin kendisi tutulmaz; yalnız sinyalin mevcut olup olmadığı kaydedilir. Böylece gereksiz kalıcı parmak izi verisi biriktirilmez.
- Kur’an metni veya araştırma içeriği hiçbir koşulda saldırgana karşı dahi değiştirilmiş/sentetik biçimde sunulmaz.

## Bilerek uygulanmayan yöntemler

- Byte-byte tarpitting bağlantı ve Worker kaynaklarını saldırganla birlikte tüketebileceği için kullanılmaz.
- İlk canary isteğinde kalıcı IP engeli NAT, VPN, önizleme botları ve güvenlik tarayıcılarında yanlış pozitif üretebileceği için uygulanmaz.
- Gizli `display:none` bağlantılar erişilebilirlik ve arama motoru politikalarıyla çelişebileceği için HTML'e eklenmez.

Kalıcı, küresel karantina ve gelişmiş JA4 kuralları uygulama belleğinde değil Cloudflare WAF/Rate Limiting katmanında yönetilmelidir.
