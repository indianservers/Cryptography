const utf8 = new TextEncoder();
const hex32le = (value: number) => [0, 8, 16, 24].map((shift) => ((value >>> shift) & 255).toString(16).padStart(2, "0")).join("");
const hex32be = (value: number) => value.toString(16).padStart(8, "0");
const rotl = (value: number, shift: number) => ((value << shift) | (value >>> (32 - shift))) >>> 0;
const rotr = (value: number, shift: number) => ((value >>> shift) | (value << (32 - shift))) >>> 0;
const add = (...values: number[]) => values.reduce((sum, value) => (sum + value) >>> 0, 0);

export const bytesToHex = (bytes: number[] | Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export function md5(message: string) {
  const bytes = Array.from(utf8.encode(message));
  const bitLength = bytes.length * 8;
  const data = [...bytes, 0x80];
  while (data.length % 64 !== 56) data.push(0);
  const length = BigInt(bitLength);
  for (let shift = 0; shift < 64; shift += 8) data.push(Number((length >> BigInt(shift)) & 255n));
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;
  const s = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const k = Array.from({ length: 64 }, (_, index) => Math.floor(Math.abs(Math.sin(index + 1)) * 2 ** 32) >>> 0);
  const rounds: { i: number; f: string; g: number; a: string; b: string; c: string; d: string }[] = [];
  for (let offset = 0; offset < data.length; offset += 64) {
    const m = Array.from({ length: 16 }, (_, index) => data[offset + index * 4] | (data[offset + index * 4 + 1] << 8) | (data[offset + index * 4 + 2] << 16) | (data[offset + index * 4 + 3] << 24));
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i += 1) {
      let f = 0;
      let g = 0;
      let name = "F";
      if (i < 16) { f = (b & c) | (~b & d); g = i; name = "F"; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; name = "G"; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; name = "H"; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; name = "I"; }
      const temp = d;
      d = c;
      c = b;
      b = add(b, rotl(add(a, f, k[i], m[g]), s[i]));
      a = temp;
      if (offset === 0) rounds.push({ i, f: name, g, a: hex32be(a), b: hex32be(b), c: hex32be(c), d: hex32be(d) });
    }
    a0 = add(a0, a); b0 = add(b0, b); c0 = add(c0, c); d0 = add(d0, d);
  }
  return { digest: hex32le(a0) + hex32le(b0) + hex32le(c0) + hex32le(d0), padded: data, rounds };
}

export function sha1Schedule(message: string) {
  const bytes = Array.from(utf8.encode(message));
  const bitLength = bytes.length * 8;
  const padded = [...bytes, 0x80];
  while ((padded.length + 8) % 64 !== 0) padded.push(0);
  const length = BigInt(bitLength);
  for (let shift = 56; shift >= 0; shift -= 8) padded.push(Number((length >> BigInt(shift)) & 255n));
  const words = Array.from({ length: 16 }, (_, index) => padded.slice(index * 4, index * 4 + 4).reduce((acc, byte) => ((acc << 8) | byte) >>> 0, 0));
  while (words.length < 80) words.push(rotl(words[words.length - 3] ^ words[words.length - 8] ^ words[words.length - 14] ^ words[words.length - 16], 1));
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476, e = 0xc3d2e1f0;
  const rounds = words.map((w, i) => {
    const f = i < 20 ? ((b & c) | (~b & d)) : i < 40 ? (b ^ c ^ d) : i < 60 ? ((b & c) | (b & d) | (c & d)) : (b ^ c ^ d);
    const k = i < 20 ? 0x5a827999 : i < 40 ? 0x6ed9eba1 : i < 60 ? 0x8f1bbcdc : 0xca62c1d6;
    const temp = add(rotl(a, 5), f, e, k, w);
    e = d; d = c; c = rotl(b, 30); b = a; a = temp;
    return { i, w: hex32be(w), a: hex32be(a), b: hex32be(b), c: hex32be(c), d: hex32be(d), e: hex32be(e) };
  });
  return { padded, words, rounds };
}

export const sha256K = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2,
];

export function sha256Trace(message: string) {
  const bytes = Array.from(utf8.encode(message));
  const bitLength = bytes.length * 8;
  const padded = [...bytes, 0x80];
  while ((padded.length + 8) % 64 !== 0) padded.push(0);
  const len = BigInt(bitLength);
  for (let shift = 56; shift >= 0; shift -= 8) padded.push(Number((len >> BigInt(shift)) & 255n));
  const schedule = Array.from({ length: 16 }, (_, index) => padded.slice(index * 4, index * 4 + 4).reduce((acc, byte) => ((acc << 8) | byte) >>> 0, 0));
  while (schedule.length < 64) {
    const s0 = rotr(schedule[schedule.length - 15], 7) ^ rotr(schedule[schedule.length - 15], 18) ^ (schedule[schedule.length - 15] >>> 3);
    const s1 = rotr(schedule[schedule.length - 2], 17) ^ rotr(schedule[schedule.length - 2], 19) ^ (schedule[schedule.length - 2] >>> 10);
    schedule.push(add(schedule[schedule.length - 16], s0, schedule[schedule.length - 7], s1));
  }
  let a = 0x6a09e667, b = 0xbb67ae85, c = 0x3c6ef372, d = 0xa54ff53a, e = 0x510e527f, f = 0x9b05688c, g = 0x1f83d9ab, h = 0x5be0cd19;
  const rounds = schedule.map((w, i) => {
    const ch = (e & f) ^ (~e & g);
    const maj = (a & b) ^ (a & c) ^ (b & c);
    const sigma1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
    const sigma0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
    const t1 = add(h, sigma1, ch, sha256K[i], w);
    const t2 = add(sigma0, maj);
    h = g; g = f; f = e; e = add(d, t1); d = c; c = b; b = a; a = add(t1, t2);
    return { i, w: hex32be(w), k: hex32be(sha256K[i]), a: hex32be(a), b: hex32be(b), c: hex32be(c), d: hex32be(d), e: hex32be(e), f: hex32be(f), g: hex32be(g), h: hex32be(h), t1: hex32be(t1), t2: hex32be(t2) };
  });
  return { padded, schedule, rounds };
}
