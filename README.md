# Âyet Atlası

Kur’an âyetlerini Arapça mushaf metni, kök-dil, bağlam ve belge diline dayalı katmanlı incelemelerle sunan edge tabanlı araştırma platformu.

## Mimari

- Vinext / React / Cloudflare Worker
- D1 üzerinde tipli ve migration kontrollü veri katmanı
- R2 belge arşivi
- Sürüm kontrollü REST API ve OpenAPI belgesi
- RUM, trace kimlikleri, JSON loglar ve health uçları
- Vitest, Playwright, güvenlik taraması ve performans bütçeli CI

## Geliştirme

Node.js 22 ve pnpm kullanılır.

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm perf:budget
```

Git çalışma kuralları için `CONTRIBUTING.md`, operasyon modeli için `docs/operations.md` dosyasına bakın.
