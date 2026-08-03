import { z } from "zod";

export const runtime = "edge";
const eventSchema = z.object({ type: z.enum(["metric", "error", "long-task"]), name: z.string().max(80), value: z.number().finite().optional(), message: z.string().max(300).optional() });
const payloadSchema = z.object({ schemaVersion: z.literal(1), sessionId: z.string().uuid(), path: z.string().startsWith("/").max(200), navigation: z.unknown().optional(), events: z.array(eventSchema).max(40) });

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const traceId = request.headers.get("x-trace-id") ?? "unknown";
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", event: "rum.batch", service: "ayet-atlasi", traceId, sessionId: parsed.data.sessionId, path: parsed.data.path, measurements: parsed.data.events }));
  return new Response(null, { status: 204 });
}
