export const runtime = "edge";

export function GET() {
  return Response.json({
    openapi: "3.1.0",
    info: { title: "Âyet Atlası API", version: "1.0.0", description: "Sürüm kontrollü içerik ve belge arşivi API'si." },
    servers: [{ url: "https://ayetatlas.org" }],
    paths: {
      "/api/v1/content": { get: { summary: "Âyet incelemelerini listeler", parameters: [{ name: "surah", in: "query", schema: { type: "integer", minimum: 1, maximum: 114 } }, { name: "ayah", in: "query", schema: { type: "integer", minimum: 1 } }], responses: { "200": { description: "İnceleme listesi" } } } },
      "/api/v1/blog": { get: { summary: "Arşivlenmiş belgeleri listeler", responses: { "200": { description: "Belge listesi" } } }, post: { summary: "Kimliği doğrulanmış yazar belgesi yükler", parameters: [{ name: "Idempotency-Key", in: "header", required: true, schema: { type: "string", format: "uuid" } }], responses: { "201": { description: "Belge ve outbox olayı oluşturuldu" }, "401": { description: "Oturum gerekli" } } } },
    },
  }, { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}
