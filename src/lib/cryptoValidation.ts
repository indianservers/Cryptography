import { parseHexStrict } from "./codecs";

export interface ValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export const explainCryptoError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (/key length|length/i.test(message)) return `${message} Check that the selected key size exactly matches the key bytes.`;
  if (/operation-specific|algorithm/i.test(message)) return `${message} This browser may not support that Web Crypto algorithm or parameter combination.`;
  if (/decrypt|auth|tag/i.test(message)) return `${message} Authentication tag, key, nonce, AAD, or ciphertext may not match.`;
  if (/padding/i.test(message)) return `${message} Padding errors usually mean wrong key/IV/ciphertext or the wrong padding setting.`;
  return message;
};

export function validateAesFields({ keyHex, keyBytes, ivHex, mode }: { keyHex: string; keyBytes: number; ivHex: string; mode: string }) {
  const issues: ValidationIssue[] = [];
  const key = parseHexStrict(keyHex, keyBytes);
  if (!key.ok) key.errors.forEach((message) => issues.push({ field: "Key", message, severity: "error" }));
  if (mode !== "ECB") {
    const ivExpected = mode === "GCM" ? 12 : 16;
    const iv = parseHexStrict(ivHex, ivExpected);
    if (!iv.ok) iv.errors.forEach((message) => issues.push({ field: mode === "GCM" ? "Nonce" : "IV", message, severity: "error" }));
  }
  if (mode === "ECB") issues.push({ field: "Mode", message: "ECB leaks repeated plaintext blocks and should only be used as an educational demo.", severity: "warning" });
  if (mode === "CTR" || mode === "GCM") issues.push({ field: "Nonce", message: `${mode} requires nonce/counter uniqueness for every encryption under the same key.`, severity: "warning" });
  return issues;
}
