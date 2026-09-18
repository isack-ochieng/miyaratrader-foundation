// Server-only helpers for Deriv token handling. Never import from the browser.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function encryptionKey(): Buffer {
  const raw = process.env["DERIV_TOKEN_ENCRYPTION_KEY"];
  if (!raw) throw new Error("Deriv token storage is not configured.");
  // Derive a fixed 32-byte key from the stored secret.
  return createHash("sha256").update(raw).digest();
}

export function encryptDerivToken(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ct]).toString("base64");
}

export function decryptDerivToken(stored: string): string {
  const buf = Buffer.from(stored, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const ct = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

export function isLikelyDerivToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{8,128}$/.test(token.trim());
}
