const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const mod = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;
const cleanLetters = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, "");

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function modInverse(a: number, modulus = 26) {
  const normalized = mod(a, modulus);
  for (let x = 1; x < modulus; x += 1) {
    if ((normalized * x) % modulus === 1) return x;
  }
  return null;
}

export function affineEncrypt(input: string, a: number, b: number) {
  if (gcd(a, 26) !== 1) throw new Error("Affine multiplier must be coprime with 26.");
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const x = alphabet.indexOf(char.toUpperCase());
    const mapped = alphabet[mod(a * x + b, 26)];
    return lower ? mapped.toLowerCase() : mapped;
  });
}

export function affineDecrypt(input: string, a: number, b: number) {
  const inverse = modInverse(a, 26);
  if (inverse === null) throw new Error("Affine multiplier must be coprime with 26.");
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const y = alphabet.indexOf(char.toUpperCase());
    const mapped = alphabet[mod(inverse * (y - b), 26)];
    return lower ? mapped.toLowerCase() : mapped;
  });
}

export function columnOrder(keyword: string) {
  const key = cleanLetters(keyword);
  if (!key) throw new Error("Keyword must contain at least one A-Z letter.");
  return key.split("").map((char, index) => ({ char, index })).sort((left, right) => left.char.localeCompare(right.char) || left.index - right.index).map((item) => item.index);
}

export function columnarEncrypt(input: string, keyword: string, padding = "X") {
  const text = cleanLetters(input);
  const order = columnOrder(keyword);
  const cols = order.length;
  const rows = Math.ceil(text.length / cols);
  const pad = cleanLetters(padding)[0] ?? "X";
  const filled = text.padEnd(rows * cols, pad);
  const grid = Array.from({ length: rows }, (_, row) => filled.slice(row * cols, row * cols + cols));
  return order.map((col) => grid.map((row) => row[col]).join("")).join("");
}

export function columnarDecrypt(input: string, keyword: string) {
  const text = cleanLetters(input);
  const order = columnOrder(keyword);
  const cols = order.length;
  if (text.length % cols !== 0) throw new Error("Ciphertext length must be divisible by keyword length.");
  const rows = text.length / cols;
  const columns = new Array<string>(cols);
  let offset = 0;
  for (const col of order) {
    columns[col] = text.slice(offset, offset + rows);
    offset += rows;
  }
  return Array.from({ length: rows }, (_, row) => columns.map((col) => col[row]).join("")).join("");
}

export function railFenceEncrypt(input: string, rails: number) {
  if (!Number.isInteger(rails) || rails < 2) throw new Error("Rail count must be an integer >= 2.");
  const rows = Array.from({ length: rails }, () => "");
  let row = 0;
  let direction = 1;
  for (const char of input) {
    rows[row] += char;
    if (row === 0) direction = 1;
    if (row === rails - 1) direction = -1;
    row += direction;
  }
  return rows.join("");
}

export function railFenceDecrypt(input: string, rails: number) {
  if (!Number.isInteger(rails) || rails < 2) throw new Error("Rail count must be an integer >= 2.");
  const path: number[] = [];
  let row = 0;
  let direction = 1;
  for (let index = 0; index < input.length; index += 1) {
    path.push(row);
    if (row === 0) direction = 1;
    if (row === rails - 1) direction = -1;
    row += direction;
  }
  const counts = Array.from({ length: rails }, (_, rail) => path.filter((item) => item === rail).length);
  const rows: string[][] = [];
  let offset = 0;
  for (const count of counts) {
    rows.push(input.slice(offset, offset + count).split(""));
    offset += count;
  }
  const positions = Array(rails).fill(0);
  return path.map((rail) => rows[rail][positions[rail]++]).join("");
}

export function validateSubstitutionAlphabet(mapping: string) {
  const clean = cleanLetters(mapping);
  if (clean.length !== 26) throw new Error("Substitution alphabet must contain exactly 26 letters.");
  if (new Set(clean).size !== 26) throw new Error("Substitution alphabet must contain 26 unique letters.");
  return clean;
}

export function substitutionEncrypt(input: string, mapping: string) {
  const clean = validateSubstitutionAlphabet(mapping);
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const mapped = clean[alphabet.indexOf(char.toUpperCase())];
    return lower ? mapped.toLowerCase() : mapped;
  });
}

export function substitutionDecrypt(input: string, mapping: string) {
  const clean = validateSubstitutionAlphabet(mapping);
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const mapped = alphabet[clean.indexOf(char.toUpperCase())];
    return lower ? mapped.toLowerCase() : mapped;
  });
}

export function playfairSquare(keyword: string) {
  const seen = new Set<string>();
  const letters = `${cleanLetters(keyword).replace(/J/g, "I")}ABCDEFGHIKLMNOPQRSTUVWXYZ`;
  return letters.split("").filter((char) => {
    if (seen.has(char)) return false;
    seen.add(char);
    return true;
  }).slice(0, 25);
}

export function playfairPrepare(input: string, filler = "X") {
  const text = cleanLetters(input).replace(/J/g, "I");
  const pad = cleanLetters(filler)[0] ?? "X";
  const pairs: string[] = [];
  for (let index = 0; index < text.length;) {
    const a = text[index];
    const b = text[index + 1];
    if (!b) {
      pairs.push(a + pad);
      index += 1;
    } else if (a === b) {
      pairs.push(a + pad);
      index += 1;
    } else {
      pairs.push(a + b);
      index += 2;
    }
  }
  return pairs;
}

export function playfairEncrypt(input: string, keyword: string, filler = "X") {
  const square = playfairSquare(keyword);
  const locate = (char: string) => {
    const index = square.indexOf(char);
    return { row: Math.floor(index / 5), col: index % 5 };
  };
  return playfairPrepare(input, filler).map((pair) => {
    const left = locate(pair[0]);
    const right = locate(pair[1]);
    if (left.row === right.row) return square[left.row * 5 + ((left.col + 1) % 5)] + square[right.row * 5 + ((right.col + 1) % 5)];
    if (left.col === right.col) return square[((left.row + 1) % 5) * 5 + left.col] + square[((right.row + 1) % 5) * 5 + right.col];
    return square[left.row * 5 + right.col] + square[right.row * 5 + left.col];
  }).join("");
}

export function hill2Encrypt(input: string, matrix: [number, number, number, number]) {
  const det = mod(matrix[0] * matrix[3] - matrix[1] * matrix[2], 26);
  if (modInverse(det, 26) === null) throw new Error("Hill matrix determinant must be invertible modulo 26.");
  const text = cleanLetters(input).padEnd(Math.ceil(cleanLetters(input).length / 2) * 2, "X");
  let output = "";
  for (let index = 0; index < text.length; index += 2) {
    const x = alphabet.indexOf(text[index]);
    const y = alphabet.indexOf(text[index + 1]);
    output += alphabet[mod(matrix[0] * x + matrix[1] * y, 26)];
    output += alphabet[mod(matrix[2] * x + matrix[3] * y, 26)];
  }
  return output;
}
