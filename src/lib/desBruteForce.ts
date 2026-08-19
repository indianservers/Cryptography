import { desCryptBlock } from "../pages/algorithms/symmetric/des/desEducationalCore";

export const DES_BRUTE_FORCE_MAX_BITS = 12;
export const DES_EFFECTIVE_KEY_BITS = 56;
export const DES_FULL_KEY_SPACE = 2 ** DES_EFFECTIVE_KEY_BITS;

export type DesSearchSpeed = "slow" | "normal" | "maximum";
export type DesSearchStatus = "idle" | "running" | "paused" | "found" | "cancelled" | "exhausted";

export interface DesKnownPair {
  plaintextHex: string;
  ciphertextHex: string;
}

const clampSearchBits = (value: number) =>
  Math.min(DES_BRUTE_FORCE_MAX_BITS, Math.max(1, Math.trunc(value)));

const bitCount = (value: number) => {
  let remaining = value;
  let count = 0;
  while (remaining) {
    count += remaining & 1;
    remaining >>>= 1;
  }
  return count;
};

/**
 * Expands the 56 effective DES key bits into eight bytes with odd parity.
 * DES discards each byte's least-significant parity bit during PC-1.
 */
export function effectiveKeyToDesKeyHex(effectiveKey: bigint) {
  const mask56 = (1n << 56n) - 1n;
  const normalized = effectiveKey & mask56;
  const bytes: string[] = [];

  for (let group = 0; group < 8; group += 1) {
    const shift = BigInt((7 - group) * 7);
    const sevenBits = Number((normalized >> shift) & 0x7fn);
    const parityBit = bitCount(sevenBits) % 2 === 0 ? 1 : 0;
    bytes.push(((sevenBits << 1) | parityBit).toString(16).padStart(2, "0"));
  }

  return bytes.join("");
}

export function desKeyForCandidate(fixedEffectiveKey: bigint, candidate: number, variableBits: number) {
  const bits = clampSearchBits(variableBits);
  const suffixMask = (1n << BigInt(bits)) - 1n;
  const effectiveKey = (fixedEffectiveKey & ~suffixMask) | (BigInt(candidate) & suffixMask);
  return {
    candidate: Number(BigInt(candidate) & suffixMask),
    effectiveKey,
    keyHex: effectiveKeyToDesKeyHex(effectiveKey),
  };
}

export interface DesBruteForceRow {
  candidate: number;
  keyHex: string;
  ciphertextHex: string;
  matches: boolean;
  hammingDistance: number;
  candidateBits: string;
  pairMatches: number;
}

export interface DesBruteForceResult {
  variableBits: number;
  keySpaceSize: number;
  attempts: number;
  match: DesBruteForceRow | null;
  sampleRows: DesBruteForceRow[];
}

export interface DesWorkerStartMessage {
  type: "start";
  pairs: DesKnownPair[];
  fixedEffectiveKeyHex: string;
  variableBits: number;
  speed: DesSearchSpeed;
}

export type DesWorkerCommand =
  | DesWorkerStartMessage
  | { type: "pause" }
  | { type: "resume" }
  | { type: "cancel" }
  | { type: "step" }
  | { type: "speed"; speed: DesSearchSpeed };

export type DesWorkerEvent =
  | {
    type: "progress";
    status: DesSearchStatus;
    attempts: number;
    keySpaceSize: number;
    elapsedMs: number;
    current: DesBruteForceRow | null;
    sampleRows: DesBruteForceRow[];
  }
  | {
    type: "complete";
    status: "found" | "exhausted";
    attempts: number;
    keySpaceSize: number;
    elapsedMs: number;
    match: DesBruteForceRow | null;
    sampleRows: DesBruteForceRow[];
  }
  | { type: "cancelled"; attempts: number; keySpaceSize: number; elapsedMs: number };

export function sanitizeDesBlockHex(value: string) {
  return value.replace(/[^0-9a-f]/gi, "").slice(0, 16).padEnd(16, "0").toLowerCase();
}

export function asciiToDesBlockHex(value: string) {
  const bytes = new TextEncoder().encode(value.slice(0, 8));
  return Array.from({ length: 8 }, (_, index) => (bytes[index] ?? 0).toString(16).padStart(2, "0")).join("");
}

export function hexToBits(value: string, width = value.length * 4) {
  const clean = value.replace(/[^0-9a-f]/gi, "") || "0";
  return BigInt(`0x${clean}`).toString(2).padStart(width, "0").slice(-width);
}

export function hammingDistanceHex(left: string, right: string) {
  const leftBits = hexToBits(left);
  const rightBits = hexToBits(right, leftBits.length);
  return leftBits.split("").reduce((distance, bit, index) => distance + (bit === rightBits[index] ? 0 : 1), 0);
}

export function candidatePosition(candidate: number, keySpaceSize: number) {
  if (keySpaceSize <= 1) return 100;
  return (candidate / (keySpaceSize - 1)) * 100;
}

export function expectedAttempts(keySpaceSize: number) {
  return {
    best: 1,
    average: Math.ceil(keySpaceSize / 2),
    worst: keySpaceSize,
  };
}

export function estimatedSeconds(keyCount: number, keysPerSecond: number) {
  return keyCount / Math.max(1, keysPerSecond);
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds)) return "unavailable";
  if (seconds < 0.001) return "<1 ms";
  if (seconds < 1) return `${(seconds * 1000).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} h`;
  if (seconds < 31557600) return `${(seconds / 86400).toFixed(1)} days`;
  return `${(seconds / 31557600).toExponential(2)} years`;
}

const weakDesKeys = new Set([
  "0101010101010101",
  "fefefefefefefefe",
  "e0e0e0e0f1f1f1f1",
  "1f1f1f1f0e0e0e0e",
]);

const semiWeakDesKeys = new Set([
  "011f011f010e010e", "1f011f010e010e01",
  "01e001e001f101f1", "e001e001f101f101",
  "01fe01fe01fe01fe", "fe01fe01fe01fe01",
  "1fe01fe00ef10ef1", "e01fe01ff10ef10e",
  "1ffe1ffe0efe0efe", "fe1ffe1ffe0efe0e",
  "e0fee0fef1fef1fe", "fee0fee0fef1fef1",
]);

export function classifyDesKey(keyHex: string) {
  const normalized = keyHex.toLowerCase();
  if (weakDesKeys.has(normalized)) return "weak";
  if (semiWeakDesKeys.has(normalized)) return "semi-weak";
  return "ordinary";
}

export function hasOddDesParity(keyHex: string) {
  const pairs = keyHex.toLowerCase().match(/../g) ?? [];
  return pairs.length === 8 && pairs.every((pair) => bitCount(Number.parseInt(pair, 16)) % 2 === 1);
}

export function buildDesCandidateRow(
  pairs: DesKnownPair[],
  fixedEffectiveKey: bigint,
  variableBits: number,
  candidate: number,
): DesBruteForceRow {
  const { keyHex } = desKeyForCandidate(fixedEffectiveKey, candidate, variableBits);
  const outputs = pairs.map((pair) => desCryptBlock(pair.plaintextHex, keyHex).outputHex);
  const pairMatches = outputs.reduce((count, output, index) => count + (output === pairs[index].ciphertextHex.toLowerCase() ? 1 : 0), 0);
  const primaryOutput = outputs[0] ?? "";
  return {
    candidate,
    keyHex,
    ciphertextHex: primaryOutput,
    matches: pairs.length > 0 && pairMatches === pairs.length,
    hammingDistance: pairs[0] ? hammingDistanceHex(primaryOutput, pairs[0].ciphertextHex) : 0,
    candidateBits: candidate.toString(2).padStart(clampSearchBits(variableBits), "0"),
    pairMatches,
  };
}

/**
 * Exhaustively searches a deliberately reduced suffix of a DES effective key.
 * The hard cap keeps this suitable for a responsive, local classroom demo.
 */
export function searchReducedDesKeySpace(
  plaintextHex: string,
  targetCiphertextHex: string,
  fixedEffectiveKey: bigint,
  variableBits: number,
): DesBruteForceResult {
  const bits = clampSearchBits(variableBits);
  const keySpaceSize = 2 ** bits;
  const normalizedTarget = targetCiphertextHex.toLowerCase();
  const sampleRows: DesBruteForceRow[] = [];
  let match: DesBruteForceRow | null = null;
  let attempts = 0;

  for (let candidate = 0; candidate < keySpaceSize; candidate += 1) {
    const row = buildDesCandidateRow(
      [{ plaintextHex, ciphertextHex: normalizedTarget }],
      fixedEffectiveKey,
      bits,
      candidate,
    );
    attempts += 1;

    if (candidate < 8 || row.matches) sampleRows.push(row);
    if (row.matches) {
      match = row;
      break;
    }
  }

  return { variableBits: bits, keySpaceSize, attempts, match, sampleRows };
}
