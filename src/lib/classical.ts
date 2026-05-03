const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const caesar = (input: string, shift: number) => input.replace(/[a-z]/gi, (char) => {
  const lower = char === char.toLowerCase();
  const index = alphabet.indexOf(char.toUpperCase());
  const mapped = alphabet[(index + shift + 26) % 26];
  return lower ? mapped.toLowerCase() : mapped;
});
export const vigenere = (input: string, keyword: string, decrypt = false) => {
  const key = keyword.replace(/[^a-z]/gi, "").toUpperCase() || "KEY";
  let used = 0;
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const shift = alphabet.indexOf(key[used++ % key.length]) * (decrypt ? -1 : 1);
    const index = alphabet.indexOf(char.toUpperCase());
    const mapped = alphabet[(index + shift + 26) % 26];
    return lower ? mapped.toLowerCase() : mapped;
  });
};
export const letterFrequency = (input: string) => alphabet.split("").map((letter) => ({ letter, count: (input.toUpperCase().match(new RegExp(letter, "g")) ?? []).length }));

