import { bytesToHex, hexPairs } from "./format";

export const utf8 = new TextEncoder();

export function toHex(bytes: ArrayBuffer | Uint8Array) {
  return bytesToHex(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
}

export function fromHex(value: string) {
  return new Uint8Array(hexPairs(value).map((byte) => parseInt(byte, 16)));
}

export async function digestHex(algorithm: AlgorithmIdentifier, message: string) {
  return toHex(await crypto.subtle.digest(algorithm, utf8.encode(message)));
}

export async function hmacHex(hash: string, key: string, message: string) {
  const cryptoKey = await crypto.subtle.importKey("raw", utf8.encode(key), { name: "HMAC", hash }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", cryptoKey, utf8.encode(message)));
}

export async function pbkdf2Hex(password: string, salt: string, iterations: number, hash: string, lengthBits: number) {
  const baseKey = await crypto.subtle.importKey("raw", utf8.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: utf8.encode(salt), iterations, hash }, baseKey, lengthBits);
  return toHex(bits);
}

export function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a < 0n ? -a : a;
}

export function egcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}

export function modInv(a: bigint, m: bigint) {
  const [g, x] = egcd(a, m);
  if (g !== 1n && g !== -1n) return null;
  return ((x % m) + m) % m;
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  let b = ((base % modulus) + modulus) % modulus;
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % modulus;
    e >>= 1n;
    b = (b * b) % modulus;
  }
  return result;
}

export function modPowTrace(base: bigint, exponent: bigint, modulus: bigint) {
  const rows: { bit: string; base: string; result: string }[] = [];
  let result = 1n;
  let b = ((base % modulus) + modulus) % modulus;
  let e = exponent;
  while (e > 0n) {
    const bit = (e & 1n) === 1n;
    if (bit) result = (result * b) % modulus;
    rows.push({ bit: bit ? "1" : "0", base: b.toString(), result: result.toString() });
    e >>= 1n;
    b = (b * b) % modulus;
  }
  return rows;
}

export function textBlocks(text: string, blockSize = 16) {
  const bytes = Array.from(utf8.encode(text));
  const blocks: string[] = [];
  for (let index = 0; index < bytes.length; index += blockSize) {
    blocks.push(bytes.slice(index, index + blockSize).map((byte) => byte.toString(16).padStart(2, "0")).join("").padEnd(blockSize * 2, "0"));
  }
  return blocks.length ? blocks : ["".padEnd(blockSize * 2, "0")];
}

export function xorHex(a: string, b: string) {
  const left = fromHex(a);
  const right = fromHex(b);
  const length = Math.min(left.length, right.length);
  const output = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) output[index] = left[index] ^ right[index];
  return toHex(output);
}

const rotl32 = (value: number, shift: number) => ((value << shift) | (value >>> (32 - shift))) >>> 0;
const add32 = (...values: number[]) => values.reduce((sum, value) => (sum + value) >>> 0, 0);

export function chachaQuarterRound(state: number[], a: number, b: number, c: number, d: number) {
  const x = [...state];
  x[a] = add32(x[a], x[b]); x[d] = rotl32(x[d] ^ x[a], 16);
  x[c] = add32(x[c], x[d]); x[b] = rotl32(x[b] ^ x[c], 12);
  x[a] = add32(x[a], x[b]); x[d] = rotl32(x[d] ^ x[a], 8);
  x[c] = add32(x[c], x[d]); x[b] = rotl32(x[b] ^ x[c], 7);
  return x;
}

export function chachaBlock(keyHex: string, nonceHex: string, counter: number) {
  const constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
  const key = fromHex(keyHex.padEnd(64, "0").slice(0, 64));
  const nonce = fromHex(nonceHex.padEnd(24, "0").slice(0, 24));
  const words = (bytes: Uint8Array) => Array.from({ length: bytes.length / 4 }, (_, i) => bytes[i * 4] | (bytes[i * 4 + 1] << 8) | (bytes[i * 4 + 2] << 16) | (bytes[i * 4 + 3] << 24));
  let state = [...constants, ...words(key), counter >>> 0, ...words(nonce)];
  const initial = [...state];
  const snapshots = [{ name: "Initial state", state: [...state] }];
  for (let round = 0; round < 10; round += 1) {
    state = chachaQuarterRound(state, 0, 4, 8, 12);
    state = chachaQuarterRound(state, 1, 5, 9, 13);
    state = chachaQuarterRound(state, 2, 6, 10, 14);
    state = chachaQuarterRound(state, 3, 7, 11, 15);
    snapshots.push({ name: `Column round ${round + 1}`, state: [...state] });
    state = chachaQuarterRound(state, 0, 5, 10, 15);
    state = chachaQuarterRound(state, 1, 6, 11, 12);
    state = chachaQuarterRound(state, 2, 7, 8, 13);
    state = chachaQuarterRound(state, 3, 4, 9, 14);
    snapshots.push({ name: `Diagonal round ${round + 1}`, state: [...state] });
  }
  const finalWords = state.map((word, index) => add32(word, initial[index]));
  const out = new Uint8Array(64);
  finalWords.forEach((word, index) => {
    out[index * 4] = word & 255;
    out[index * 4 + 1] = (word >>> 8) & 255;
    out[index * 4 + 2] = (word >>> 16) & 255;
    out[index * 4 + 3] = (word >>> 24) & 255;
  });
  return { snapshots, keystream: toHex(out) };
}

export function frequency(text: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.split("").map((letter) => ({ letter, count: (text.toUpperCase().match(new RegExp(letter, "g")) ?? []).length }));
}

