type CachedVerse = { text: string; expiresAt: number };
const memory = new Map<string, CachedVerse>();
const TTL = 10 * 60_000;
const MAX_ENTRIES = 256;

export function getCachedVerse(key: string) {
  const value = memory.get(key);
  if (!value || value.expiresAt <= Date.now()) { memory.delete(key); return undefined; }
  return value.text;
}

export function setCachedVerse(key: string, text: string) {
  if (memory.size >= MAX_ENTRIES) memory.delete(memory.keys().next().value as string);
  memory.set(key, { text, expiresAt: Date.now() + TTL });
}
