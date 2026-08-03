/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  DEGRADED_MODE?: string;
  SHADOW_ORIGIN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; media-src 'self' https://download.quranicaudio.com https://verses.quran.foundation; connect-src 'self' https://api.alquran.cloud; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; worker-src 'self'; manifest-src 'self'; upgrade-insecure-requests",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const TRUSTED_ORIGINS = new Set([
  "https://ayetatlas.org",
  "https://www.ayetatlas.org",
  "https://ayet-atlasi.bilgicigdem3535.chatgpt.site",
]);
const RATE_LIMITS = new Map<string, { count: number; resetAt: number }>();
const CANARY_HITS = new Map<string, { count: number; blockedUntil: number }>();
const SINGLE_FLIGHTS = new Map<string, Promise<Response>>();
const CANARY_PATH = "/api/internal/archive-index-7f3a9c";
const RESILIENT_READ_PATHS = new Set(["/api/content", "/api/content/chunks", "/api/content/coverage", "/page.md", "/llms.txt", "/llms-full.txt"]);
const SUPPORTED_LOCALES = new Set(["tr", "en", "de", "ar"]);
const COUNTRY_LOCALES: Record<string, string> = { TR: "tr", DE: "de", AT: "de", CH: "de", SA: "ar", AE: "ar", EG: "ar", QA: "ar" };

function detectLocale(request: Request): string {
  const cookieLocale = request.headers.get("Cookie")?.match(/(?:^|;\s*)USER_LOCALE=(tr|en|de|ar)(?:;|$)/)?.[1];
  if (cookieLocale) return cookieLocale;
  const accepted = (request.headers.get("Accept-Language") ?? "").split(",").map((item) => item.split(";")[0].trim().slice(0, 2).toLowerCase());
  const browserLocale = accepted.find((item) => SUPPORTED_LOCALES.has(item));
  if (browserLocale) return browserLocale;
  const country = request.headers.get("CF-IPCountry") ?? request.cf?.country;
  return country ? COUNTRY_LOCALES[country] ?? "en" : "tr";
}

type BotSignals = { score?: number; verifiedBot?: boolean; ja4?: string };

function botSignals(request: Request): BotSignals {
  const cf = request.cf as unknown as { botManagement?: { score?: number; verifiedBot?: boolean; ja4?: string } } | undefined;
  return cf?.botManagement ?? {};
}

function rateLimit(request: Request, pathname: string): Response | undefined {
  const isWrite = request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  const limit = pathname === "/api/blog" && isWrite ? 5 : pathname.startsWith("/api/") ? 120 : 300;
  const windowMs = pathname === "/api/blog" && isWrite ? 10 * 60_000 : 60_000;
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const signals = botSignals(request);
  if (signals.verifiedBot) return undefined;
  const key = `${ip}:${request.method}:${pathname}`;
  const now = Date.now();
  const current = RATE_LIMITS.get(key);
  const bucket = !current || current.resetAt <= now ? { count: 1, resetAt: now + windowMs } : { count: current.count + 1, resetAt: current.resetAt };
  RATE_LIMITS.set(key, bucket);
  if (RATE_LIMITS.size > 5000) for (const [storedKey, value] of RATE_LIMITS) if (value.resetAt <= now) RATE_LIMITS.delete(storedKey);
  const adjustedLimit = typeof signals.score === "number" && signals.score < 15 ? Math.max(12, Math.floor(limit / 4)) : limit;
  if (bucket.count <= adjustedLimit) return undefined;
  return Response.json({ error: "Çok fazla istek gönderildi. Lütfen biraz sonra yeniden deneyin." }, { status: 429, headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)), "Cache-Control": "no-store" } });
}

function withPlatformHeaders(response: Response, pathname: string, request?: Request, nonce?: string): Response {
  const contentType = response.headers.get("Content-Type") ?? "";
  const prefersDark = request?.headers.get("Cookie")?.match(/(?:^|;\s*)theme=(dark|light)/)?.[1] === "dark";
  const transformed = nonce && contentType.includes("text/html")
    ? new HTMLRewriter().on("html", { element(element) { if (prefersDark) element.setAttribute("class", "theme-dark"); } }).on("script", { element(element) { element.setAttribute("nonce", nonce); } }).on("style", { element(element) { element.setAttribute("nonce", nonce); } }).transform(response)
    : response;
  const secured = new Response(transformed.body, transformed);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value);
  if (nonce && contentType.includes("text/html")) {
    secured.headers.set("Content-Security-Policy", SECURITY_HEADERS["Content-Security-Policy"].replace("script-src 'self'", `script-src 'nonce-${nonce}' 'strict-dynamic' 'self'`));
  }
  if (/\.(?:css|js|woff2?|ttf|webp|png|jpe?g|svg)$/i.test(pathname)) {
    secured.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/api/")) {
    secured.headers.set("Cache-Control", secured.headers.get("Cache-Control") ?? "no-store");
  }
  secured.headers.set("Server-Timing", "edge;desc=Cloudflare");
  secured.headers.set("X-Content-Provenance", "https://ayetatlas.org/legal");
  const origin = request?.headers.get("Origin");
  if (origin && TRUSTED_ORIGINS.has(origin)) {
    secured.headers.set("Access-Control-Allow-Origin", origin);
    secured.headers.set("Access-Control-Allow-Credentials", "true");
    secured.headers.append("Vary", "Origin");
  }
  return secured;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const startedAt = performance.now();
    const url = new URL(request.url);
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))));
    const traceId = request.headers.get("x-trace-id")?.replace(/[^a-f0-9]/gi, "").slice(0, 32) || crypto.randomUUID().replaceAll("-", "");
    const traceparent = `00-${traceId.padEnd(32, "0")}-0000000000000001-01`;
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const analyticsConsent = /(?:^|;\s*)consent_analytics=granted(?:;|$)/.test(cookieHeader);
    const existingVariant = analyticsConsent ? cookieHeader.match(/(?:^|;\s*)aa_reader=(control|focus)/)?.[1] : undefined;
    const experimentVariant = analyticsConsent ? existingVariant ?? (Number.parseInt(traceId.slice(0, 2), 16) % 2 ? "focus" : "control") : "control";
    const signals = botSignals(request);

    const finalize = (response: Response) => {
      const output = new Response(response.body, response);
      const durationMs = Math.round((performance.now() - startedAt) * 100) / 100;
      output.headers.set("X-Trace-Id", traceId);
      output.headers.set("Traceparent", traceparent);
      output.headers.set("X-Experiment-Reader", experimentVariant);
      if (analyticsConsent && !existingVariant) output.headers.append("Set-Cookie", `aa_reader=${experimentVariant}; Path=/; Max-Age=2592000; Secure; HttpOnly; SameSite=Lax`);
      if (!analyticsConsent && /(?:^|;\s*)aa_reader=/.test(cookieHeader)) output.headers.append("Set-Cookie", "aa_reader=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax");
      output.headers.append("Server-Timing", `app;dur=${durationMs}`);
      console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: response.status >= 500 ? "error" : response.status >= 400 ? "warn" : "info", event: "http.request", service: "ayet-atlasi", traceId, method: request.method, path: url.pathname, status: response.status, durationMs, colo: request.cf?.colo ?? "local", botScore: signals.score ?? null, verifiedBot: signals.verifiedBot ?? false, tlsFingerprintPresent: Boolean(signals.ja4) }));
      return output;
    };

    if (url.pathname === CANARY_PATH) {
      const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
      const now = Date.now();
      const previous = CANARY_HITS.get(ip);
      const record = !previous || previous.blockedUntil <= now ? { count: 1, blockedUntil: now + 15 * 60_000 } : { count: previous.count + 1, blockedUntil: previous.blockedUntil };
      CANARY_HITS.set(ip, record);
      console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: "warn", event: "security.canary", service: "ayet-atlasi", traceId, path: url.pathname, repeated: record.count > 1, botScore: signals.score ?? null, verifiedBot: signals.verifiedBot ?? false, tlsFingerprintPresent: Boolean(signals.ja4) }));
      const status = record.count > 1 && !signals.verifiedBot ? 403 : 204;
      return finalize(withPlatformHeaders(new Response(null, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } }), url.pathname, request));
    }

    const requesterIp = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const canaryRecord = CANARY_HITS.get(requesterIp);
    if (canaryRecord && canaryRecord.count > 1 && canaryRecord.blockedUntil > Date.now() && !signals.verifiedBot) {
      return finalize(withPlatformHeaders(Response.json({ error: "Erişim geçici olarak sınırlandırıldı." }, { status: 403, headers: { "Cache-Control": "no-store" } }), url.pathname, request));
    }

    if (request.method === "OPTIONS") {
      const origin = request.headers.get("Origin");
      if (!origin || !TRUSTED_ORIGINS.has(origin)) return finalize(withPlatformHeaders(new Response(null, { status: 403 }), url.pathname, request));
      return finalize(withPlatformHeaders(new Response(null, { status: 204, headers: { "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" } }), url.pathname, request));
    }
    const limited = rateLimit(request, url.pathname);
    if (limited) return finalize(withPlatformHeaders(limited, url.pathname, request));

    const normalizedPath = url.pathname.replace(/\/{2,}/g, "/").replace(/[A-Z]/g, (letter) => letter.toLowerCase());
    const withoutTrailingSlash = normalizedPath !== "/" && normalizedPath.endsWith("/") ? normalizedPath.slice(0, -1) : normalizedPath;
    if (url.hostname === "www.ayetatlas.org" || withoutTrailingSlash !== url.pathname) {
      url.hostname = url.hostname === "www.ayetatlas.org" ? "ayetatlas.org" : url.hostname;
      url.pathname = withoutTrailingSlash;
      return finalize(withPlatformHeaders(Response.redirect(url, 308), url.pathname, request));
    }
    if (url.pathname === "/" && request.method === "GET" && !signals.verifiedBot && !request.headers.get("Accept")?.includes("text/markdown")) {
      url.pathname = `/${detectLocale(request)}`;
      const redirect = Response.redirect(url, 307);
      redirect.headers.append("Vary", "Cookie, Accept-Language, CF-IPCountry");
      return finalize(withPlatformHeaders(redirect, url.pathname, request));
    }

    if (url.pathname === "/api/health") {
      return finalize(withPlatformHeaders(Response.json({
        status: "ok",
        service: "ayet-atlasi",
        edge: true,
        timestamp: new Date().toISOString(),
      }, { headers: { "Cache-Control": "no-store" } }), url.pathname, request));
    }

    if (url.pathname === "/livez") return finalize(withPlatformHeaders(Response.json({ status: "alive", service: "ayet-atlasi" }), url.pathname, request));
    if (url.pathname === "/readyz") {
      const bindingsReady = Boolean(env.DB && env.ASSETS && env.IMAGES);
      return finalize(withPlatformHeaders(Response.json({ status: bindingsReady ? "ready" : "not-ready", checks: { db: Boolean(env.DB), assets: Boolean(env.ASSETS), images: Boolean(env.IMAGES) } }, { status: bindingsReady ? 200 : 503 }), url.pathname, request));
    }
    if (url.pathname === "/healthz") {
      try {
        await env.DB.prepare("SELECT 1 AS ok").first();
        return finalize(withPlatformHeaders(Response.json({ status: "healthy", checks: { edge: "ok", database: "ok" } }), url.pathname, request));
      } catch {
        return finalize(withPlatformHeaders(Response.json({ status: "unhealthy", checks: { edge: "ok", database: "failed" } }, { status: 503 }), url.pathname, request));
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imageResponse = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return finalize(withPlatformHeaders(imageResponse, url.pathname, request));
    }

    if (env.DEGRADED_MODE === "1" && ["/api/analytics", "/api/telemetry", "/api/vitals"].includes(url.pathname)) {
      return finalize(withPlatformHeaders(new Response(null, { status: 204, headers: { "X-Degraded-Mode": "active", "Cache-Control": "no-store" } }), url.pathname, request));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-trace-id", traceId);
    requestHeaders.set("traceparent", traceparent);
    requestHeaders.set("x-experiment-reader", experimentVariant);
    const wantsMarkdown = request.headers.get("Accept")?.includes("text/markdown") ?? false;
    const routedRequest = url.pathname === "/" && (url.searchParams.get("format") === "md" || wantsMarkdown)
      ? new Request(new URL("/page.md", request.url), { method: request.method, headers: requestHeaders, body: request.body })
      : new Request(request, { headers: requestHeaders });
    const resilientRead = request.method === "GET" && RESILIENT_READ_PATHS.has(new URL(routedRequest.url).pathname);
    const cacheKey = new Request(routedRequest.url, { method: "GET", headers: { Accept: request.headers.get("Accept") ?? "*/*" } });
    let response: Response;
    if (resilientRead) {
      let flight = SINGLE_FLIGHTS.get(cacheKey.url);
      if (!flight) {
        flight = handler.fetch(routedRequest, env, ctx);
        SINGLE_FLIGHTS.set(cacheKey.url, flight);
        void flight.then(() => SINGLE_FLIGHTS.delete(cacheKey.url), () => SINGLE_FLIGHTS.delete(cacheKey.url));
      }
      try {
        response = (await flight).clone();
        if (response.ok) ctx.waitUntil(caches.default.put(cacheKey, response.clone()));
        else {
          const stale = await caches.default.match(cacheKey);
          if (stale) response = new Response(stale.body, { status: 200, headers: stale.headers });
        }
      } catch {
        const stale = await caches.default.match(cacheKey);
        if (!stale) throw new Error("Resilient read failed without a cached response");
        const staleHeaders = new Headers(stale.headers);
        staleHeaders.set("Warning", '110 - "Response is stale"');
        staleHeaders.set("X-Cache-Fallback", "stale-if-error");
        response = new Response(stale.body, { status: 200, headers: staleHeaders });
      }
    } else response = await handler.fetch(routedRequest, env, ctx);

    if (env.SHADOW_ORIGIN && request.method === "GET" && url.pathname === "/api/content" && Number.parseInt(traceId.slice(0, 2), 16) < 3) {
      const shadowUrl = new URL("/api/content", env.SHADOW_ORIGIN);
      ctx.waitUntil(fetch(shadowUrl, { headers: { "X-Shadow-Request": "1", "User-Agent": "Ayet-Atlasi-Shadow/1.0" } }).then(() => undefined).catch(() => undefined));
    }
    return finalize(withPlatformHeaders(response, url.pathname, request, nonce));
  },
};

export default worker;
