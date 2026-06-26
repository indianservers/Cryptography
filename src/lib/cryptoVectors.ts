import { caesar } from "./classical";
import { bytesToHex, decodeInput } from "./codecs";
import { decodeBase64Text, encodeBase64Text, hmacSha256Hex, pbkdf2Sha256Hex, shaHex } from "./simpleDemos";

export interface SyncVector {
  id: string;
  route: string;
  description: string;
  run: () => string;
  expected: string;
}

export interface AsyncVector {
  id: string;
  route: string;
  description: string;
  run: () => Promise<string>;
  expected: string;
}

const atbash = (input: string) => input.replace(/[a-z]/gi, (char) => {
  const base = char >= "a" && char <= "z" ? 97 : 65;
  return String.fromCharCode(25 - (char.charCodeAt(0) - base) + base);
});

const rot13 = (input: string) => caesar(input, 13);

export const syncCryptoVectors: SyncVector[] = [
  {
    id: "base64-encode-hello",
    route: "/algorithms/encoding/base64",
    description: "Base64 encodes ASCII text",
    run: () => encodeBase64Text("hello"),
    expected: "aGVsbG8=",
  },
  {
    id: "base64-decode-hello",
    route: "/algorithms/encoding/base64",
    description: "Base64 decodes ASCII text",
    run: () => decodeBase64Text("aGVsbG8="),
    expected: "hello",
  },
  {
    id: "hex-decode-hello",
    route: "/algorithms/encoding/hex",
    description: "Hex parser decodes bytes",
    run: () => new TextDecoder().decode(decodeInput("68656c6c6f", "Hex").bytes),
    expected: "hello",
  },
  {
    id: "hex-encode-hello",
    route: "/algorithms/encoding/hex",
    description: "Hex encoding emits lowercase byte hex",
    run: () => bytesToHex(new TextEncoder().encode("hello")),
    expected: "68656c6c6f",
  },
  {
    id: "binary-decode-A",
    route: "/algorithms/encoding/binary",
    description: "Binary parser decodes one byte",
    run: () => new TextDecoder().decode(decodeInput("01000001", "Binary").bytes),
    expected: "A",
  },
  {
    id: "caesar-shift-3",
    route: "/algorithms/classical/caesar-cipher",
    description: "Caesar shift preserves case and punctuation",
    run: () => caesar("Attack at dawn!", 3),
    expected: "Dwwdfn dw gdzq!",
  },
  {
    id: "rot13-round",
    route: "/algorithms/classical/rot13",
    description: "ROT13 transforms letters by 13 positions",
    run: () => rot13("Hello, World!"),
    expected: "Uryyb, Jbeyq!",
  },
  {
    id: "atbash-basic",
    route: "/algorithms/classical/atbash",
    description: "Atbash mirrors the alphabet",
    run: () => atbash("abc XYZ"),
    expected: "zyx CBA",
  },
];

export const asyncCryptoVectors: AsyncVector[] = [
  {
    id: "sha256-abc",
    route: "/algorithms/hash/sha2",
    description: "SHA-256 NIST abc vector via Web Crypto",
    run: () => shaHex("SHA-256", "abc"),
    expected: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  },
  {
    id: "hmac-sha256-rfc4231-case-1",
    route: "/algorithms/mac/hmac",
    description: "HMAC-SHA256 RFC 4231 test case 1",
    run: () => hmacSha256Hex("\x0b".repeat(20), "Hi There"),
    expected: "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
  },
  {
    id: "pbkdf2-sha256-rfc6070-style",
    route: "/algorithms/kdf/pbkdf2",
    description: "PBKDF2-HMAC-SHA256 deterministic known-answer vector",
    run: () => pbkdf2Sha256Hex("password", "salt", 1),
    expected: "120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b",
  },
];

export const cryptoVectorRoutes = Array.from(new Set([...syncCryptoVectors, ...asyncCryptoVectors].map((vector) => vector.route))).sort();
