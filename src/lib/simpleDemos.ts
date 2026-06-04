import { desCryptBlock } from "../pages/algorithms/symmetric/des/desEducationalCore";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const asciiPattern = /^[\x00-\x7f]*$/;

export function asciiError(value: string, label = "Input") {
  return asciiPattern.test(value) ? "" : `${label} must contain ASCII characters only.`;
}

export function bytesToHex(bytes: Uint8Array | number[]) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string) {
  const clean = hex.replace(/[^0-9a-f]/gi, "");
  return Uint8Array.from({ length: Math.floor(clean.length / 2) }, (_, index) => parseInt(clean.slice(index * 2, index * 2 + 2), 16));
}

export function asciiToFixedHex(value: string, bytes: number) {
  return bytesToHex(Uint8Array.from({ length: bytes }, (_, index) => encoder.encode(value)[index] ?? 0));
}

export function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export function base64ToBytes(value: string) {
  const clean = value.trim().replace(/-/g, "+").replace(/_/g, "/");
  const padded = clean.padEnd(Math.ceil(clean.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

export function encodeBase64Text(value: string) {
  return bytesToBase64(encoder.encode(value));
}

export function decodeBase64Text(value: string) {
  return decoder.decode(base64ToBytes(value));
}

export async function shaHex(algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", message: string) {
  const digest = await crypto.subtle.digest(algorithm, encoder.encode(message));
  return bytesToHex(new Uint8Array(digest));
}

export async function hmacSha256Hex(key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey("raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToHex(new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message))));
}

export async function pbkdf2Sha256Hex(password: string, salt: string, iterations: number) {
  const baseKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: encoder.encode(salt), iterations }, baseKey, 256);
  return bytesToHex(new Uint8Array(bits));
}

async function aesKeyFromAscii(key: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(key));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

function fixedAsciiBytes(value: string, bytes: number) {
  const raw = encoder.encode(value);
  return Uint8Array.from({ length: bytes }, (_, index) => raw[index] ?? 0);
}

export async function aesGcmEncryptBase64(plaintext: string, key: string, nonce: string) {
  const cryptoKey = await aesKeyFromAscii(key);
  const iv = fixedAsciiBytes(nonce, 12);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, encoder.encode(plaintext));
  return bytesToBase64(new Uint8Array(encrypted));
}

export async function aesGcmDecryptBase64(ciphertextBase64: string, key: string, nonce: string) {
  const cryptoKey = await aesKeyFromAscii(key);
  const iv = fixedAsciiBytes(nonce, 12);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, cryptoKey, base64ToBytes(ciphertextBase64));
  return decoder.decode(decrypted);
}

export function desEncryptBase64(plaintext: string, key: string) {
  const bytes = encoder.encode(plaintext);
  const blockCount = Math.max(1, Math.ceil(bytes.length / 8));
  const keyHex = asciiToFixedHex(key, 8);
  const outputHex = Array.from({ length: blockCount }, (_, block) => {
    const chunk = Uint8Array.from({ length: 8 }, (_, index) => bytes[block * 8 + index] ?? 0);
    return desCryptBlock(bytesToHex(chunk), keyHex).outputHex;
  }).join("");
  return bytesToBase64(hexToBytes(outputHex));
}

export function desDecryptBase64(ciphertextBase64: string, key: string) {
  const cipherBytes = base64ToBytes(ciphertextBase64);
  const keyHex = asciiToFixedHex(key, 8);
  const blocks = Array.from({ length: Math.ceil(cipherBytes.length / 8) }, (_, block) => {
    const chunk = Uint8Array.from({ length: 8 }, (_, index) => cipherBytes[block * 8 + index] ?? 0);
    return desCryptBlock(bytesToHex(chunk), keyHex, true).outputHex;
  }).join("");
  return decoder.decode(hexToBytes(blocks)).replace(/\0+$/g, "");
}
