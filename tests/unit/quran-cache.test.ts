import { describe, expect, it } from "vitest";
import { getCachedVerse, setCachedVerse } from "../../lib/server/quran/cache";

describe("Quran verse memory cache", () => {
  it("returns a cached verse", () => { setCachedVerse("3:1", "الم"); expect(getCachedVerse("3:1")).toBe("الم"); });
  it("does not cross verse keys", () => expect(getCachedVerse("3:2")).toBeUndefined());
});
