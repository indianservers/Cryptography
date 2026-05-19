export const textToBytes = (value: string) => new TextEncoder().encode(value);
export const bytesToHex = (bytes: ArrayLike<number>) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const hexPairs = (hex: string) => hex.replace(/[^0-9a-f]/gi, "").match(/.{1,2}/g) ?? [];
export const textToHex = (value: string) => bytesToHex(textToBytes(value));
export const textToBinary = (value: string) => Array.from(textToBytes(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
export const randomHex = (bytes: number) => { const values = new Uint8Array(bytes); crypto.getRandomValues(values); return bytesToHex(values); };
export const asciiToBytes = (value: string, size?: number) => {
  const raw = Uint8Array.from(Array.from(value), (char) => char.charCodeAt(0) & 0xff);
  if (size === undefined) return raw;
  const output = new Uint8Array(size);
  output.set(raw.slice(0, size));
  return output;
};
export const asciiToHex = (value: string, size?: number) => bytesToHex(asciiToBytes(value, size));
export const randomAscii = (length: number) => {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, (byte) => String.fromCharCode(33 + (byte % 94))).join("");
};
export const chunk = <T,>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
