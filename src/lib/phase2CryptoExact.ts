import { bytesToHex } from "./codecs";

const encoder = new TextEncoder();
const asBufferSource = (bytes: Uint8Array): ArrayBuffer => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;

export function hexToBytesStrict(hex: string) {
  const clean = hex.replace(/\s+/g, "");
  if (!/^[0-9a-f]*$/i.test(clean) || clean.length % 2 !== 0) throw new Error("Expected even-length hex.");
  return Uint8Array.from({ length: clean.length / 2 }, (_, index) => parseInt(clean.slice(index * 2, index * 2 + 2), 16));
}

export async function hmacSha256Bytes(key: Uint8Array, data: Uint8Array) {
  const cryptoKey = await crypto.subtle.importKey("raw", asBufferSource(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, asBufferSource(data)));
}

export async function hkdfSha256(ikm: Uint8Array, salt: Uint8Array, info: Uint8Array, length: number) {
  const hashLength = 32;
  if (length > 255 * hashLength) throw new Error("HKDF output length is too large.");
  const actualSalt = salt.length ? salt : new Uint8Array(hashLength);
  const prk = await hmacSha256Bytes(actualSalt, ikm);
  const blocks: Uint8Array[] = [];
  let previous = new Uint8Array();
  for (let counter = 1; blocks.reduce((sum, block) => sum + block.length, 0) < length; counter += 1) {
    const input = new Uint8Array(previous.length + info.length + 1);
    input.set(previous, 0);
    input.set(info, previous.length);
    input[input.length - 1] = counter;
    previous = await hmacSha256Bytes(prk, input);
    blocks.push(previous);
  }
  const okm = new Uint8Array(blocks.reduce((sum, block) => sum + block.length, 0));
  let offset = 0;
  for (const block of blocks) {
    okm.set(block, offset);
    offset += block.length;
  }
  return { prk, okm: okm.slice(0, length) };
}

export interface PemBlock {
  label: string;
  base64: string;
  der: Uint8Array;
}

export function parsePemBlocks(input: string): PemBlock[] {
  const blocks: PemBlock[] = [];
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(input))) {
    const base64 = match[2].replace(/\s+/g, "");
    const binary = atob(base64);
    blocks.push({
      label: match[1],
      base64,
      der: Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    });
  }
  return blocks;
}

export async function sha256Bytes(data: Uint8Array) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", asBufferSource(data)));
}

export async function doubleSha256Hex(data: Uint8Array | string) {
  const bytes = typeof data === "string" ? encoder.encode(data) : data;
  return bytesToHex(await sha256Bytes(await sha256Bytes(bytes)));
}

export const reverseHexByteOrder = (hex: string) => bytesToHex(hexToBytesStrict(hex).reverse());
