import { desSBoxes } from "./desTables";
export const desSBoxOutput = (box: number, bits: string) => {
  const clean = bits.padEnd(6, "0").slice(0, 6);
  const row = parseInt(clean[0] + clean[5], 2);
  const col = parseInt(clean.slice(1, 5), 2);
  return desSBoxes[box][row][col].toString(2).padStart(4, "0");
};

