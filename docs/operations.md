# Âyet Atlası operasyon modeli

Üretim hedefi Cloudflare Worker + D1 + R2'dir. Bu nedenle Docker, Kubernetes ve PgBouncer üretim yolunun parçası değildir. Kaynak kodu, migration'lar ve `.openai/hosting.json` birlikte sürümlenir.

Her değişiklik güvenlik taraması, lint, birim testi, entegrasyon testi, üretim derlemesi, performans bütçesi ve migration kontrolünden geçer. Pull request E2E işi masaüstü ve mobil Chromium akışlarını sınar.

Sites sürümleri değiştirilemez yayın nesneleridir. Yeni sürüm başarısız olursa canlı sürüm değiştirilmez. Geri alma, son sağlıklı Sites sürümünün yeniden yayımlanmasıyla yapılır. Otomatik hata-oranı rollback'i ancak Sites tarafından desteklenen dağıtım otomasyonu veya güvenli bir deployment webhook'u sağlandığında açılmalıdır.

Release Please, Conventional Commits geçmişinden sürüm PR'ı ve Changelog üretir. Birleştirilen release PR'ı `vX.Y.Z` etiketi oluşturur.
