import { expect, test } from "@playwright/test";

test("atlas opens and verse navigation responds", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Sâffât/i })).toBeVisible();
  const next = page.getByRole("button", { name: "Sonraki âyet" });
  await next.click();
  await expect(page.getByText(/Âyet\s*2\s*\/\s*182/i)).toBeVisible();
});

test("machine-readable endpoints stay available", async ({ request }) => {
  expect((await request.get("/api/openapi.json")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/api/health")).status()).toBe(200);
});
