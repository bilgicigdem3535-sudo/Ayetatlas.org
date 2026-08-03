import { describe, expect, it } from "vitest";
import { verseStudies } from "../../app/content";

const fields = ["sourceBasis", "literalFocus", "rootLanguage", "context", "documentReading", "symbolicHypothesis", "reflection"] as const;

describe("verse study quality gate", () => {
  it("keeps every layer populated and substantial", () => {
    for (const [key, study] of Object.entries(verseStudies)) {
      expect(key).toMatch(/^\d{1,3}:\d{1,3}$/);
      for (const field of fields) expect(study[field].trim().length, `${key}.${field}`).toBeGreaterThan(24);
    }
  });

  it("does not reuse an entire seven-layer record", () => {
    const fingerprints = Object.entries(verseStudies).map(([key, study]) => ({ key, value: fields.map((field) => study[field].trim()).join("\u241f") }));
    expect(new Set(fingerprints.map((item) => item.value)).size).toBe(fingerprints.length);
  });
});
