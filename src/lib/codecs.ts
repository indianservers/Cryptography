export type InputEncoding = "Text" | "Hex" | "Base64" | "Binary";

export interface ParseResult {
  ok: boolean;
  bytes: Uint8Array;
  errors: string[];
  normalized: string;
}

export function bytesToHex(bytes: Uint8Array | ArrayBuffer) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function parseHexStrict(value: string, expectedBytes?: number): ParseResult {
  const compact = value.replace(/\s+/g, "");
  const errors: string[] = [];
  if (/[^0-9a-f]/i.test(compact)) errors.push("Hex input contains non-hex characters.");
  if (compact.length % 2 !== 0) errors.push("Hex input must contain an even number of characters.");
  if (expectedBytes !== undefined && compact.length !== expectedBytes * 2) errors.push(`Expected ${expectedBytes} bytes (${expectedBytes * 2} hex characters), got ${Math.floor(compact.length / 2)} bytes.`);
  const safe = compact.replace(/[^0-9a-f]/gi, "");
  const bytes = new Uint8Array(Array.from({ length: Math.floor(safe.length / 2) }, (_, index) => parseInt(safe.slice(index * 2, index * 2 + 2), 16)));
  return { ok: errors.length === 0, bytes, errors, normalized: safe.toLowerCase() };
}

export function decodeInput(value: string, encoding: InputEncoding): ParseResult {
  try {
    if (encoding === "Hex") return parseHexStrict(value);
    if (encoding === "Binary") {
      const compact = value.replace(/\s+/g, "");
      const errors: string[] = [];
      if (/[^01]/.test(compact)) errors.push("Binary input can only contain 0 and 1.");
      if (compact.length % 8 !== 0) errors.push("Binary input length must be a multiple of 8 bits.");
      const bytes = new Uint8Array(Array.from({ length: Math.floor(compact.length / 8) }, (_, index) => parseInt(compact.slice(index * 8, index * 8 + 8), 2)));
      return { ok: errors.length === 0, bytes, errors, normalized: compact };
    }
    if (encoding === "Base64") {
      const raw = atob(value.replace(/\s+/g, ""));
      const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0));
      return { ok: true, bytes, errors: [], normalized: value.replace(/\s+/g, "") };
    }
    const bytes = new TextEncoder().encode(value);
    return { ok: true, bytes, errors: [], normalized: value };
  } catch (error) {
    return { ok: false, bytes: new Uint8Array(), errors: [error instanceof Error ? error.message : "Unable to decode input."], normalized: value };
  }
}
