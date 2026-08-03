const encoder = new TextEncoder();

export function normalizeEmailForIndex(email: string): string {
  return email.trim().normalize("NFKC").toLocaleLowerCase("en-US");
}

export async function createBlindIndex(value: string, secret: string, purpose: string): Promise<string> {
  if (encoder.encode(secret).byteLength < 32) throw new Error("Blind-index secret must be at least 32 bytes");
  if (!/^[a-z0-9:_-]{3,80}$/i.test(purpose)) throw new Error("Blind-index purpose is invalid");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${purpose}\u0000${value}`));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createEmailBlindIndex(email: string, secret: string): Promise<string> {
  return createBlindIndex(normalizeEmailForIndex(email), secret, "user-email:v1");
}
