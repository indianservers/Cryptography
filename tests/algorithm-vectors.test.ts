import { describe, expect, it } from "vitest";
import { asyncCryptoVectors, syncCryptoVectors } from "../src/lib/cryptoVectors";
import {
  affineDecrypt,
  affineEncrypt,
  columnOrder,
  columnarDecrypt,
  columnarEncrypt,
  hill2Encrypt,
  modInverse,
  playfairEncrypt,
  playfairPrepare,
  railFenceDecrypt,
  railFenceEncrypt,
  substitutionDecrypt,
  substitutionEncrypt,
} from "../src/lib/classicalExact";
import { bytesFromHex, expandAes128Key, hexWord, mixColumns } from "../src/pages/algorithms/symmetric/aes/aesEducationalCore";
import { doubleSha256Hex, hexToBytesStrict, hkdfSha256, parsePemBlocks } from "../src/lib/phase2CryptoExact";
import { bytesToHex } from "../src/lib/codecs";

describe("algorithm vector foundation", () => {
  for (const vector of syncCryptoVectors) {
    it(vector.id, () => {
      expect(vector.run()).toBe(vector.expected);
    });
  }

  for (const vector of asyncCryptoVectors) {
    it(vector.id, async () => {
      expect(await vector.run()).toBe(vector.expected);
    });
  }
});

describe("phase 2 exact educational helpers", () => {
  it("encrypts and decrypts affine cipher with invertible multiplier", () => {
    expect(affineEncrypt("AFFINECIPHER", 5, 8)).toBe("IHHWVCSWFRCP");
    expect(affineDecrypt("IHHWVCSWFRCP", 5, 8)).toBe("AFFINECIPHER");
    expect(modInverse(5, 26)).toBe(21);
    expect(() => affineEncrypt("TEST", 13, 1)).toThrow(/coprime/);
  });

  it("uses stable duplicate-key order for columnar transposition", () => {
    expect(columnOrder("BALLOON")).toEqual([1, 0, 2, 3, 6, 4, 5]);
    const cipher = columnarEncrypt("DEFENDTHEEASTWALLOFTHECASTLE", "FORTIFICATION", "X");
    expect(columnarDecrypt(cipher, "FORTIFICATION")).toBe("DEFENDTHEEASTWALLOFTHECASTLEXXXXXXXXXXX");
  });

  it("matches the standard rail fence sample and round trips", () => {
    const cipher = railFenceEncrypt("WEAREDISCOVEREDFLEEATONCE", 3);
    expect(cipher).toBe("WECRLTEERDSOEEFEAOCAIVDEN");
    expect(railFenceDecrypt(cipher, 3)).toBe("WEAREDISCOVEREDFLEEATONCE");
    expect(() => railFenceEncrypt("ABC", 1)).toThrow(/Rail count/);
  });

  it("validates monoalphabetic substitution alphabets", () => {
    const mapping = "QWERTYUIOPASDFGHJKLZXCVBNM";
    const cipher = substitutionEncrypt("Attack at dawn!", mapping);
    expect(cipher).toBe("Qzzqea qz rqvf!");
    expect(substitutionDecrypt(cipher, mapping)).toBe("Attack at dawn!");
    expect(() => substitutionEncrypt("ABC", "AAAAAAAAAAAAAAAAAAAAAAAAAA")).toThrow(/unique/);
  });

  it("matches common Playfair example convention", () => {
    expect(playfairPrepare("BALLOON")).toEqual(["BA", "LX", "LO", "ON"]);
    expect(playfairEncrypt("HIDETHEGOLDINTHETREESTUMP", "PLAYFAIR EXAMPLE")).toBe("BMODZBXDNABEKUDMUIXMMOUVIF");
  });

  it("encrypts a 2x2 Hill cipher sample", () => {
    expect(hill2Encrypt("HELP", [3, 3, 2, 5])).toBe("HIAT");
    expect(() => hill2Encrypt("HELP", [2, 4, 2, 4])).toThrow(/determinant/);
  });

  it("matches FIPS AES MixColumns and AES-128 key expansion samples", () => {
    expect(hexWord(mixColumns([0xdb, 0x13, 0x53, 0x45]).slice(0, 4))).toBe("8e4da1bc");
    const roundKeys = expandAes128Key(bytesFromHex("000102030405060708090a0b0c0d0e0f", 16));
    expect(hexWord(roundKeys[10])).toBe("13111d7fe3944a17f307a78b4d2b30c5");
  });

  it("matches RFC 5869 HKDF-SHA256 test case 1", async () => {
    const ikm = hexToBytesStrict("0b".repeat(22));
    const salt = hexToBytesStrict("000102030405060708090a0b0c");
    const info = hexToBytesStrict("f0f1f2f3f4f5f6f7f8f9");
    const result = await hkdfSha256(ikm, salt, info, 42);
    expect(bytesToHex(result.prk)).toBe("077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5");
    expect(bytesToHex(result.okm)).toBe("3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865");
  });

  it("extracts simple PEM blocks without claiming X.509 validation", () => {
    const [block] = parsePemBlocks("-----BEGIN TEST BLOCK-----\nAQID\n-----END TEST BLOCK-----");
    expect(block.label).toBe("TEST BLOCK");
    expect(block.base64).toBe("AQID");
    expect(Array.from(block.der)).toEqual([1, 2, 3]);
  });

  it("computes double SHA-256 over controlled bytes", async () => {
    expect(await doubleSha256Hex("hello")).toBe("9595c9df90075148eb06860365df33584b75bff782a510c6cd4883a419833d50");
  });
});
