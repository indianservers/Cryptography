import { desExpansionPermutation, desFinalPermutation, desInitialPermutation, desPc1, desPc2, desPermutationP, desSBoxes, desShiftSchedule } from "./desTables";
export const desSBoxOutput = (box: number, bits: string) => {
  const clean = bits.padEnd(6, "0").slice(0, 6);
  const row = parseInt(clean[0] + clean[5], 2);
  const col = parseInt(clean.slice(1, 5), 2);
  return desSBoxes[box][row][col].toString(2).padStart(4, "0");
};

export interface DesRoundTrace {
  round: number;
  left: string;
  right: string;
  expanded: string;
  roundKey: string;
  xored: string;
  sbox: string;
  pbox: string;
  nextLeft: string;
  nextRight: string;
}

export interface DesTrace {
  inputHex: string;
  keyHex: string;
  initialPermutation: string;
  roundKeys: string[];
  rounds: DesRoundTrace[];
  preOutput: string;
  outputBits: string;
  outputHex: string;
}

const cleanHex = (value: string, chars: number) => value.replace(/[^0-9a-f]/gi, "").padEnd(chars, "0").slice(0, chars).toLowerCase();
const hexToBits = (value: string, chars: number) => BigInt("0x" + cleanHex(value, chars)).toString(2).padStart(chars * 4, "0");
const bitsToHex = (bits: string) => BigInt("0b" + bits).toString(16).padStart(Math.ceil(bits.length / 4), "0");
const permute = (bits: string, table: number[]) => table.map((position) => bits[position - 1]).join("");
const xorBits = (a: string, b: string) => a.split("").map((bit, index) => bit === b[index] ? "0" : "1").join("");
const rotateLeft = (value: string, amount: number) => value.slice(amount) + value.slice(0, amount);

export function desKeySchedule(keyHex: string) {
  const keyBits = hexToBits(keyHex, 16);
  const pc1 = permute(keyBits, desPc1);
  let c = pc1.slice(0, 28);
  let d = pc1.slice(28);
  return desShiftSchedule.map((shift) => {
    c = rotateLeft(c, shift);
    d = rotateLeft(d, shift);
    return permute(c + d, desPc2);
  });
}

export function desF(right: string, roundKey: string) {
  const expanded = permute(right, desExpansionPermutation);
  const xored = xorBits(expanded, roundKey);
  const sbox = Array.from({ length: 8 }, (_, index) => desSBoxOutput(index, xored.slice(index * 6, index * 6 + 6))).join("");
  const pbox = permute(sbox, desPermutationP);
  return { expanded, xored, sbox, pbox };
}

export function desCryptBlock(blockHex: string, keyHex: string, decrypt = false): DesTrace {
  const inputHex = cleanHex(blockHex, 16);
  const key = cleanHex(keyHex, 16);
  const initialPermutation = permute(hexToBits(inputHex, 16), desInitialPermutation);
  const roundKeys = desKeySchedule(key);
  const activeKeys = decrypt ? [...roundKeys].reverse() : roundKeys;
  let left = initialPermutation.slice(0, 32);
  let right = initialPermutation.slice(32);
  const rounds = activeKeys.map((roundKey, index) => {
    const f = desF(right, roundKey);
    const nextLeft = right;
    const nextRight = xorBits(left, f.pbox);
    const row = { round: index + 1, left, right, roundKey, ...f, nextLeft, nextRight };
    left = nextLeft;
    right = nextRight;
    return row;
  });
  const preOutput = right + left;
  const outputBits = permute(preOutput, desFinalPermutation);
  return { inputHex, keyHex: key, initialPermutation, roundKeys: activeKeys, rounds, preOutput, outputBits, outputHex: bitsToHex(outputBits) };
}

export function tripleDesEde(blockHex: string, key1: string, key2: string, key3: string, decrypt = false) {
  if (!decrypt) {
    const stage1 = desCryptBlock(blockHex, key1, false);
    const stage2 = desCryptBlock(stage1.outputHex, key2, true);
    const stage3 = desCryptBlock(stage2.outputHex, key3, false);
    return { stages: [stage1, stage2, stage3], outputHex: stage3.outputHex };
  }
  const stage1 = desCryptBlock(blockHex, key3, true);
  const stage2 = desCryptBlock(stage1.outputHex, key2, false);
  const stage3 = desCryptBlock(stage2.outputHex, key1, true);
  return { stages: [stage1, stage2, stage3], outputHex: stage3.outputHex };
}
