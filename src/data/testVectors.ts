export interface TestVector {
  id: string;
  algorithm: string;
  name: string;
  input: Record<string, string | number>;
  expected: Record<string, string>;
  source: string;
}

export const testVectors: TestVector[] = [
  {
    id: "aes-128-cbc-zero-iv-nist-block",
    algorithm: "AES",
    name: "AES-128 one-block CBC, zero IV",
    input: {
      mode: "CBC",
      key: "000102030405060708090a0b0c0d0e0f",
      iv: "00000000000000000000000000000000",
      plaintextHex: "00112233445566778899aabbccddeeff",
      padding: "No padding",
    },
    expected: { ciphertextHex: "69c4e0d86a7b0430d8cdb78070b4c55a" },
    source: "FIPS-197 AES known-answer block, applied as first CBC block with zero IV",
  },
  {
    id: "sha256-abc",
    algorithm: "SHA-256",
    name: "SHA-256('abc')",
    input: { message: "abc" },
    expected: { digestHex: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" },
    source: "NIST SHA-256 standard test vector",
  },
  {
    id: "pbkdf2-rfc6070-1",
    algorithm: "PBKDF2",
    name: "RFC 6070 password/password salt iteration 1",
    input: { password: "password", salt: "salt", iterations: 1, hash: "SHA-1", lengthBits: 160 },
    expected: { derivedHex: "0c60c80f961f0e71f3a9b524af6012062fe037a6" },
    source: "RFC 6070",
  },
];

export const vectorsFor = (algorithm: string) => testVectors.filter((vector) => vector.algorithm === algorithm);
