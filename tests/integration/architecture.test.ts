import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { GET as openApi } from "../../app/api/openapi.json/route";

describe("backend contracts", () => {
  it("publishes a versioned OpenAPI contract", async () => { const body = await openApi().json(); expect(body.openapi).toBe("3.1.0"); expect(body.paths["/api/v1/blog"]).toBeTruthy(); });
  it("keeps idempotency and outbox in one migration", async () => { const sql = await readFile("drizzle/0001_tiny_gladiator.sql", "utf8"); expect(sql).toContain("idempotency_key"); expect(sql).toContain("outbox_events"); expect(sql).toContain("uq_blog_posts_tenant_idempotency"); });
  it("packages logical D1 and R2 bindings", async () => { const hosting = JSON.parse(await readFile(".openai/hosting.json", "utf8")); expect(hosting).toMatchObject({ d1: "DB", r2: "BLOG_FILES" }); });
});
