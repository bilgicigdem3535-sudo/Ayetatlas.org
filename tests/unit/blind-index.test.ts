import { describe, expect, it } from "vitest";
import { createBlindIndex, createEmailBlindIndex } from "../../lib/server/privacy/blind-index";

const secret = "test-only-secret-that-is-at-least-thirty-two-bytes-long";

describe("blind indexing", () => {
  it("normalizes equivalent email forms", async () => {
    await expect(createEmailBlindIndex("  PERSON@Example.COM ", secret)).resolves.toBe(await createEmailBlindIndex("person@example.com", secret));
  });
  it("separates indexes by purpose", async () => {
    await expect(createBlindIndex("same", secret, "email:v1")).resolves.not.toBe(await createBlindIndex("same", secret, "phone:v1"));
  });
  it("rejects weak secrets", async () => {
    await expect(createEmailBlindIndex("person@example.com", "too-short")).rejects.toThrow(/32 bytes/);
  });
});
