export const runtime = "edge";

type RouteContext = { params: Promise<{ surah: string; ayah: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { surah, ayah } = await context.params;
  const surahNo = Number(surah);
  const ayahNo = Number(ayah);
  if (!Number.isInteger(surahNo) || !Number.isInteger(ayahNo) || surahNo < 1 || surahNo > 114 || ayahNo < 1 || ayahNo > 286) {
    return Response.json({ error: "Geçersiz sûre veya âyet numarası." }, { status: 400 });
  }

  const requestOptions = { headers: { Accept: "application/json" }, cf: { cacheTtl: 86400, cacheEverything: true } };
  const arabicResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNo}:${ayahNo}/quran-uthmani`, requestOptions);
  if (!arabicResponse.ok) return Response.json({ error: "Mushaf kaynağına ulaşılamadı." }, { status: 502 });
  type QuranData = { text?: string; numberInSurah?: number; surah?: { number?: number }; edition?: { identifier?: string } };
  const payload = await arabicResponse.json() as { data?: QuranData };
  if (!payload.data?.text || payload.data.numberInSurah !== ayahNo || payload.data.surah?.number !== surahNo || payload.data.edition?.identifier !== "quran-uthmani") {
    return Response.json({ error: "Âyet metni doğrulanamadı." }, { status: 502 });
  }
  return Response.json({ text: payload.data.text, surah: surahNo, ayah: ayahNo }, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
  });
}
