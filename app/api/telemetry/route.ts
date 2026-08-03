import { z } from "zod";

export const runtime = "edge";
const eventSchema = z.object({ type: z.enum(["metric", "error", "long-task"]), name: z.string().max(80), value: z.number().finite().optional(), message: z.string().max(300).optional() });
const payloadSchema = z.object({ schemaVersion: z.literal(1), sessionId: z.string().uuid(), path: z.string().startsWith("/").max(200), navigation: z.unknown().optional(), events: z.array(eventSchema).max(40) });

function redact(value?: string) {
  return value
    ?.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\b(?:\d[ -]?){13,19}\b/g, "[redacted-number]");
}

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return new Response(null, { status: 400 });
  const traceId = request.headers.get("x-trace-id") ?? "unknown";
  const measurements = parsed.data.events.map((event) => ({ ...event, message: redact(event.message) }));
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: "info", event: "rum.batch", service: "ayet-atlasi", traceId, sessionId: parsed.data.sessionId, path: parsed.data.path, measurements }));
  return new Response(null, { status: 204 });
}
