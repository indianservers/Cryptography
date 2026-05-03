import { aesSBox } from "./aesTables";

export interface AesStep {
  id: string;
  round: number;
  operation: "Input" | "AddRoundKey" | "SubBytes" | "ShiftRows" | "MixColumns" | "Ciphertext";
  title: string;
  explanation: string;
  state: number[];
  previousState: number[];
  roundKey?: number[];
  byteMap?: { index: number; before: number; after: number; row: number; col: number }[];
}

const rcon = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

export const cleanHex = (value: string, bytes: number) => value.replace(/[^0-9a-f]/gi, "").padEnd(bytes * 2, "0").slice(0, bytes * 2);

export const bytesFromHex = (value: string, bytes: number) => {
  const clean = cleanHex(value, bytes);
  return Array.from({ length: bytes }, (_, index) => parseInt(clean.slice(index * 2, index * 2 + 2), 16));
};

export const hexByte = (value: number) => value.toString(16).padStart(2, "0");
export const hexWord = (values: number[]) => values.map(hexByte).join("");

const clone = (state: number[]) => [...state];

export function addRoundKey(state: number[], roundKey: number[]) {
  return state.map((byte, index) => byte ^ roundKey[index]);
}

export function subBytesDetailed(state: number[]) {
  const byteMap = state.map((byte, index) => {
    const row = byte >> 4;
    const col = byte & 0x0f;
    return { index, before: byte, after: aesSBox[byte], row, col };
  });
  return { state: byteMap.map((item) => item.after), byteMap };
}

export function shiftRows(state: number[]) {
  const output = new Array<number>(16);
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      output[col * 4 + row] = state[((col + row) % 4) * 4 + row];
    }
  }
  return output;
}

const xtime = (value: number) => ((value << 1) ^ ((value & 0x80) ? 0x1b : 0)) & 0xff;
const mul2 = (value: number) => xtime(value);
const mul3 = (value: number) => xtime(value) ^ value;

export function mixColumns(state: number[]) {
  const output = clone(state);
  for (let col = 0; col < 4; col += 1) {
    const offset = col * 4;
    const a0 = state[offset];
    const a1 = state[offset + 1];
    const a2 = state[offset + 2];
    const a3 = state[offset + 3];
    output[offset] = mul2(a0) ^ mul3(a1) ^ a2 ^ a3;
    output[offset + 1] = a0 ^ mul2(a1) ^ mul3(a2) ^ a3;
    output[offset + 2] = a0 ^ a1 ^ mul2(a2) ^ mul3(a3);
    output[offset + 3] = mul3(a0) ^ a1 ^ a2 ^ mul2(a3);
  }
  return output.map((byte) => byte & 0xff);
}

const rotWord = (word: number[]) => [word[1], word[2], word[3], word[0]];
const subWord = (word: number[]) => word.map((byte) => aesSBox[byte]);
const xorWords = (a: number[], b: number[]) => a.map((byte, index) => byte ^ b[index]);

export function expandAes128Key(key: number[]) {
  const words: number[][] = [];
  for (let index = 0; index < 4; index += 1) {
    words.push(key.slice(index * 4, index * 4 + 4));
  }
  for (let index = 4; index < 44; index += 1) {
    let temp = [...words[index - 1]];
    if (index % 4 === 0) {
      temp = subWord(rotWord(temp));
      temp[0] ^= rcon[index / 4];
    }
    words.push(xorWords(words[index - 4], temp));
  }
  return Array.from({ length: 11 }, (_, round) => words.slice(round * 4, round * 4 + 4).flat());
}

function pushStep(steps: AesStep[], round: number, operation: AesStep["operation"], title: string, explanation: string, previousState: number[], state: number[], roundKey?: number[], byteMap?: AesStep["byteMap"]) {
  steps.push({
    id: `${round}-${operation}-${steps.length}`,
    round,
    operation,
    title,
    explanation,
    previousState: clone(previousState),
    state: clone(state),
    roundKey: roundKey ? clone(roundKey) : undefined,
    byteMap,
  });
}

export function buildAes128Steps(plaintextHex: string, keyHex: string) {
  const input = bytesFromHex(plaintextHex, 16);
  const key = bytesFromHex(keyHex, 16);
  const roundKeys = expandAes128Key(key);
  const steps: AesStep[] = [];
  let state = clone(input);

  pushStep(steps, 0, "Input", "Step 1: input block", "The 16 plaintext bytes are loaded into the AES state matrix column by column.", state, state);
  let next = addRoundKey(state, roundKeys[0]);
  pushStep(steps, 0, "AddRoundKey", "Step 2: initial AddRoundKey", "Each state byte is XORed with round key 0 from the expanded key schedule.", state, next, roundKeys[0]);
  state = next;

  for (let round = 1; round <= 9; round += 1) {
    const sub = subBytesDetailed(state);
    pushStep(steps, round, "SubBytes", `Round ${round}: SubBytes`, "Every byte is replaced through the real AES S-box. High nibble selects row; low nibble selects column.", state, sub.state, undefined, sub.byteMap);
    state = sub.state;

    next = shiftRows(state);
    pushStep(steps, round, "ShiftRows", `Round ${round}: ShiftRows`, "Rows 1, 2, and 3 rotate left by 1, 2, and 3 bytes. Row 0 stays in place.", state, next);
    state = next;

    next = mixColumns(state);
    pushStep(steps, round, "MixColumns", `Round ${round}: MixColumns`, "Each column is multiplied by the fixed AES matrix in GF(2^8), spreading byte changes through the column.", state, next);
    state = next;

    next = addRoundKey(state, roundKeys[round]);
    pushStep(steps, round, "AddRoundKey", `Round ${round}: AddRoundKey`, `The state is XORed with round key ${round}.`, state, next, roundKeys[round]);
    state = next;
  }

  const sub = subBytesDetailed(state);
  pushStep(steps, 10, "SubBytes", "Round 10: SubBytes", "The final round still uses the S-box substitution.", state, sub.state, undefined, sub.byteMap);
  state = sub.state;

  next = shiftRows(state);
  pushStep(steps, 10, "ShiftRows", "Round 10: ShiftRows", "The final round rotates rows just like earlier rounds.", state, next);
  state = next;

  next = addRoundKey(state, roundKeys[10]);
  pushStep(steps, 10, "AddRoundKey", "Round 10: final AddRoundKey", "The final round omits MixColumns and XORs round key 10 to produce ciphertext.", state, next, roundKeys[10]);
  state = next;
  pushStep(steps, 10, "Ciphertext", "Ciphertext", "This is the final AES block after all 10 AES-128 rounds.", state, state);

  return { input, key, roundKeys, steps, ciphertext: state };
}

export function changedIndexes(previous: number[], current: number[]) {
  return current.map((byte, index) => byte !== previous[index] ? index : -1).filter((index) => index >= 0);
}
