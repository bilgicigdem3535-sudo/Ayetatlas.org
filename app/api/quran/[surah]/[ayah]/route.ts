export const runtime = "edge";

type RouteContext = { params: Promise<{ surah: string; ayah: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { surah, ayah } = await context.params;
  const surahNo = Number(surah);
  const ayahNo = Number(ayah);
  if (!Number.isInteger(surahNo) || !Number.isInteger(ayahNo) || surahNo < 1 || surahNo > 114 || ayahNo < 1 || ayahNo > 286) {
    return Response.json({ error: "Geçersiz sûre veya âyet numarası." }, { status: 400 });
  }

  const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}/quran-uthmani`, {
    headers: { Accept: "application/json" },
    cf: { cacheTtl: 86400, cacheEverything: true },
  });
  if (!response.ok) return Response.json({ error: "Mushaf kaynağına ulaşılamadı." }, { status: 502 });
  const payload = await response.json() as { data?: { text?: string; numberInSurah?: number } };
  if (!payload.data?.text || payload.data.numberInSurah !== ayahNo) {
    return Response.json({ error: "Âyet metni doğrulanamadı." }, { status: 502 });
  }
  return Response.json({ text: payload.data.text, surah: surahNo, ayah: ayahNo }, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
  });
}
