export const textToBytes = (value: string) => new TextEncoder().encode(value);
export const bytesToHex = (bytes: ArrayLike<number>) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const hexPairs = (hex: string) => hex.replace(/[^0-9a-f]/gi, "").match(/.{1,2}/g) ?? [];
export const textToHex = (value: string) => bytesToHex(textToBytes(value));
export const textToBinary = (value: string) => Array.from(textToBytes(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
export const randomHex = (bytes: number) => { const values = new Uint8Array(bytes); crypto.getRandomValues(values); return bytesToHex(values); };
export const chunk = <T,>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));

