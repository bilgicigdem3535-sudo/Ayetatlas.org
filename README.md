# Ã‚yet AtlasÄ±

Kurâ€™an Ã¢yetlerini ArapÃ§a mushaf metni, kÃ¶k-dil, baÄŸlam ve belge diline dayalÄ± katmanlÄ± incelemelerle sunan edge tabanlÄ± araÅŸtÄ±rma platformu.

## Mimari

- Vinext / React / Cloudflare Worker
- D1 Ã¼zerinde tipli ve migration kontrollÃ¼ veri katmanÄ±
- R2 belge arÅŸivi
- SÃ¼rÃ¼m kontrollÃ¼ REST API ve OpenAPI belgesi
- RUM, trace kimlikleri, JSON loglar ve health uÃ§larÄ±
- Vitest, Playwright, gÃ¼venlik taramasÄ± ve performans bÃ¼tÃ§eli CI

## GeliÅŸtirme

Node.js 22 ve pnpm kullanÄ±lÄ±r.

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
pnpm perf:budget
```

Git Ã§alÄ±ÅŸma kurallarÄ± iÃ§in `CONTRIBUTING.md`, operasyon modeli iÃ§in `docs/operations.md` dosyasÄ±na bakÄ±n.

