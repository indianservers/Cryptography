export const cleanHex = (value: string, fallback = "") => (value.replace(/[^0-9a-f]/gi, "") || fallback).toLowerCase();
export const hexToBytes = (hex: string) => Uint8Array.from((cleanHex(hex).match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte.padEnd(2, "0"), 16)));
export const bytesToHex = (bytes: ArrayLike<number>) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const textToBytes = (value: string) => new TextEncoder().encode(value);
export const bytesToText = (bytes: Uint8Array) => new TextDecoder().decode(bytes);
export const xorBytes = (input: Uint8Array, stream: Uint8Array) => input.map((byte, index) => byte ^ stream[index]);

export interface Rc4TraceRow {
  step: number;
  i: number;
  j: number;
  si: number;
  sj: number;
  keystream: number;
}

export function rc4(keyBytes: Uint8Array, input: Uint8Array) {
  const key = keyBytes.length ? keyBytes : new Uint8Array([0]);
  const s = Array.from({ length: 256 }, (_, index) => index);
  const ksaTrace: Rc4TraceRow[] = [];
  let j = 0;
  for (let i = 0; i < 256; i += 1) {
    j = (j + s[i] + key[i % key.length]) & 255;
    [s[i], s[j]] = [s[j], s[i]];
    if (i < 16) ksaTrace.push({ step: i, i, j, si: s[i], sj: s[j], keystream: 0 });
  }
  const prgaTrace: Rc4TraceRow[] = [];
  const stream = new Uint8Array(input.length);
  let i = 0;
  j = 0;
  for (let step = 0; step < input.length; step += 1) {
    i = (i + 1) & 255;
    j = (j + s[i]) & 255;
    [s[i], s[j]] = [s[j], s[i]];
    const keystream = s[(s[i] + s[j]) & 255];
    stream[step] = keystream;
    if (step < 64) prgaTrace.push({ step, i, j, si: s[i], sj: s[j], keystream });
  }
  return { keystream: stream, output: xorBytes(input, stream), ksaTrace, prgaTrace, finalS: s };
}

const add32 = (a: number, b: number) => (a + b) >>> 0;
const sub32 = (a: number, b: number) => (a - b) >>> 0;
const rotl32 = (value: number, shift: number) => ((value << (shift & 31)) | (value >>> (32 - (shift & 31)))) >>> 0;
const rotr32 = (value: number, shift: number) => ((value >>> (shift & 31)) | (value << (32 - (shift & 31)))) >>> 0;

export interface Rc5RoundTrace {
  round: number;
  a: number;
  b: number;
  rotationA: number;
  rotationB: number;
}

export function rc5KeySchedule(keyBytes: Uint8Array, rounds: number) {
  const u = 4;
  const c = Math.max(1, Math.ceil(keyBytes.length / u));
  const l = Array.from({ length: c }, () => 0);
  for (let i = keyBytes.length - 1; i >= 0; i -= 1) l[Math.floor(i / u)] = ((l[Math.floor(i / u)] << 8) + keyBytes[i]) >>> 0;
  const s = Array.from({ length: 2 * (rounds + 1) }, () => 0);
  s[0] = 0xb7e15163;
  for (let i = 1; i < s.length; i += 1) s[i] = add32(s[i - 1], 0x9e3779b9);
  let a = 0;
  let b = 0;
  let i = 0;
  let j = 0;
  for (let k = 0; k < 3 * Math.max(s.length, l.length); k += 1) {
    a = s[i] = rotl32(add32(add32(s[i], a), b), 3);
    b = l[j] = rotl32(add32(add32(l[j], a), b), add32(a, b));
    i = (i + 1) % s.length;
    j = (j + 1) % l.length;
  }
  return s;
}

const readWordLE = (bytes: Uint8Array, offset: number) => ((bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8) | ((bytes[offset + 2] ?? 0) << 16) | ((bytes[offset + 3] ?? 0) << 24)) >>> 0;
const wordHex = (value: number) => value.toString(16).padStart(8, "0");
const wordHexLE = (value: number) => [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255].map((byte) => byte.toString(16).padStart(2, "0")).join("");

export function rc5EncryptBlock(blockHex: string, keyHex: string, rounds: number) {
  const block = hexToBytes(cleanHex(blockHex).padEnd(16, "0").slice(0, 16));
  const key = hexToBytes(keyHex);
  const s = rc5KeySchedule(key, rounds);
  let a = add32(readWordLE(block, 0), s[0]);
  let b = add32(readWordLE(block, 4), s[1]);
  const trace: Rc5RoundTrace[] = [{ round: 0, a, b, rotationA: 0, rotationB: 0 }];
  for (let i = 1; i <= rounds; i += 1) {
    const rotationA = b & 31;
    a = add32(rotl32((a ^ b) >>> 0, rotationA), s[2 * i]);
    const rotationB = a & 31;
    b = add32(rotl32((b ^ a) >>> 0, rotationB), s[2 * i + 1]);
    trace.push({ round: i, a, b, rotationA, rotationB });
  }
  return { s, trace, outputHex: wordHexLE(a) + wordHexLE(b) };
}

export function rc5DecryptBlock(cipherHex: string, keyHex: string, rounds: number) {
  const block = hexToBytes(cleanHex(cipherHex).padEnd(16, "0").slice(0, 16));
  const s = rc5KeySchedule(hexToBytes(keyHex), rounds);
  let a = readWordLE(block, 0);
  let b = readWordLE(block, 4);
  const trace: Rc5RoundTrace[] = [];
  for (let i = rounds; i >= 1; i -= 1) {
    const rotationB = a & 31;
    b = rotr32(sub32(b, s[2 * i + 1]), rotationB) ^ a;
    const rotationA = b & 31;
    a = rotr32(sub32(a, s[2 * i]), rotationA) ^ b;
    trace.push({ round: i, a: a >>> 0, b: b >>> 0, rotationA, rotationB });
  }
  a = sub32(a, s[0]);
  b = sub32(b, s[1]);
  trace.push({ round: 0, a, b, rotationA: 0, rotationB: 0 });
  return { s, trace, outputHex: wordHexLE(a) + wordHexLE(b) };
}
