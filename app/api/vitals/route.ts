export const runtime = "edge";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return new Response(null, { status: 403 });
  try {
    const report = await request.json() as { path?: string; metrics?: Array<{ name?: string; value?: number }> };
    const metrics = report.metrics?.filter((metric) => ["LCP", "CLS", "INP"].includes(metric.name ?? "") && Number.isFinite(metric.value)).slice(0, 3) ?? [];
    console.log(JSON.stringify({ event: "web-vitals", path: String(report.path ?? "/").slice(0, 160), metrics }));
  } catch { return new Response(null, { status: 400 }); }
  return new Response(null, { status: 204 });
}
