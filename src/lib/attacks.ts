import { bytesToHex, hexPairs, textToBytes } from "./format";
import { extendedGcd, mod, modInverse, parseBigInt } from "./appliedMath";

export { parseBigInt };

export const englishFrequency: Record<string, number> = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0, D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0, P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.15, X: 0.15, Q: 0.1, Z: 0.07,
};

const commonWords = ["THE", "AND", "ING", "ION", "YOU", "THAT", "HAVE", "FOR", "NOT", "WITH"];

export function cleanHex(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").toLowerCase();
}

export function hexToBytes(value: string) {
  return Uint8Array.from(hexPairs(value).map((byte) => parseInt(byte, 16)));
}

export function bytesToText(bytes: Uint8Array) {
  return new TextDecoder().decode(bytes);
}

export function xorBytes(left: Uint8Array, right: Uint8Array) {
  const length = Math.min(left.length, right.length);
  return Uint8Array.from({ length }, (_, index) => left[index] ^ right[index]);
}

export function xorHex(left: string, right: string) {
  return bytesToHex(xorBytes(hexToBytes(left), hexToBytes(right)));
}

export function textToHexValue(value: string) {
  return bytesToHex(textToBytes(value));
}

export function caesarShift(value: string, shift: number) {
  return value.replace(/[a-z]/gi, (char) => {
    const base = char >= "a" && char <= "z" ? 97 : 65;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift + 2600) % 26) + base);
  });
}

export function letterFrequency(text: string) {
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  const total = Math.max(letters.length, 1);
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
    const count = (letters.match(new RegExp(letter, "g")) ?? []).length;
    return { letter, count, percent: (count / total) * 100, expected: englishFrequency[letter] ?? 0 };
  });
}

export function englishScore(text: string) {
  const upper = text.toUpperCase();
  const letters = upper.replace(/[^A-Z]/g, "");
  const total = Math.max(letters.length, 1);
  const chi = letterFrequency(text).reduce((sum, row) => {
    const expected = (row.expected / 100) * total;
    return sum + ((row.count - expected) ** 2) / Math.max(expected, 0.1);
  }, 0);
  const wordBonus = commonWords.reduce((sum, word) => sum + (upper.includes(word) ? 10 : 0), 0);
  const printableRatio = Array.from(text).filter((char) => /[\x09\x0a\x0d\x20-\x7e]/.test(char)).length / Math.max(text.length, 1);
  return Math.round((200 - chi + wordBonus + printableRatio * 40) * 100) / 100;
}

export function caesarCandidates(ciphertext: string) {
  return Array.from({ length: 26 }, (_, shift) => {
    const plaintext = caesarShift(ciphertext, -shift);
    return { shift, plaintext, score: englishScore(plaintext) };
  }).sort((a, b) => b.score - a.score);
}

export function ecbBlocks(hex: string, blockBytes: number) {
  const clean = cleanHex(hex);
  const size = Math.max(1, blockBytes) * 2;
  const blocks = clean.match(new RegExp(`.{1,${size}}`, "g")) ?? [];
  const counts = new Map<string, number>();
  blocks.forEach((block) => counts.set(block, (counts.get(block) ?? 0) + 1));
  return blocks.map((block, index) => ({ index, block, count: counts.get(block) ?? 0, repeated: (counts.get(block) ?? 0) > 1 }));
}

export function integerNthRoot(value: bigint, n: bigint) {
  if (value < 0n || n <= 0n) return 0n;
  if (value < 2n) return value;
  let low = 1n;
  let high = value;
  while (low <= high) {
    const mid = (low + high) >> 1n;
    const powered = mid ** n;
    if (powered === value) return mid;
    if (powered < value) low = mid + 1n;
    else high = mid - 1n;
  }
  return high;
}

export function factorTrialRows(nInput: string, maxDivisorInput: string) {
  const n = parseBigInt(nInput, 0n);
  const maxDivisor = parseBigInt(maxDivisorInput, 100000n);
  const rows: { divisor: bigint; remainder: bigint; divides: boolean }[] = [];
  let factor: bigint | null = null;
  if (n > 1n) {
    for (let d = 2n; d * d <= n && d <= maxDivisor; d = d === 2n ? 3n : d + 2n) {
      const remainder = n % d;
      const divides = remainder === 0n;
      rows.push({ divisor: d, remainder, divides });
      if (divides) {
        factor = d;
        break;
      }
    }
  }
  return { n, factor, cofactor: factor ? n / factor : null, rows };
}

export function rsaPrivateFromFactors(p: bigint, q: bigint, e: bigint) {
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const d = modInverse(e, phi);
  return { n, phi, d };
}

export function modPow(base: bigint, exponent: bigint, modulus: bigint) {
  if (modulus <= 1n) return 0n;
  let result = 1n;
  let b = mod(base, modulus);
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % modulus;
    b = (b * b) % modulus;
    e >>= 1n;
  }
  return result;
}

export function bezoutInverse(a: bigint, m: bigint) {
  const result = extendedGcd(a, m);
  return { ...result, inverse: result.gcd === 1n ? mod(result.x, m) : null };
}
