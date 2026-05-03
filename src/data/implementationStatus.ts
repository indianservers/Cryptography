import type { BrowserSupport, ImplementationStatus } from "../types";

const webCryptoRoutes = new Set([
  "/algorithms/symmetric/aes",
  "/algorithms/modes/ctr",
  "/algorithms/modes/gcm",
  "/algorithms/hash/sha-2",
  "/algorithms/hash/sha-256-step",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/tools/benchmark",
  "/algorithms/tools/audit",
  "/algorithms/tools/random-bytes-generator",
]);

const customRoutes = new Set([
  "/algorithms/classical/caesar-cipher",
  "/algorithms/classical/rot13",
  "/algorithms/classical/atbash",
  "/algorithms/classical/vigenere-cipher",
  "/algorithms/symmetric/aes-128-step",
  "/algorithms/symmetric/aes-rounds",
  "/algorithms/symmetric/aes-192-step",
  "/algorithms/symmetric/aes-256-step",
  "/algorithms/symmetric/aes-sbox",
  "/algorithms/symmetric/des",
  "/algorithms/symmetric/des-full-step",
  "/algorithms/symmetric/des-sbox",
  "/algorithms/stream/chacha20",
  "/algorithms/asymmetric/diffie-hellman",
  "/algorithms/asymmetric/rsa",
  "/algorithms/asymmetric/rsa-key-generation",
  "/algorithms/asymmetric/rsa-encryption",
  "/algorithms/asymmetric/rsa-decryption",
  "/algorithms/asymmetric/rsa-signature",
  "/algorithms/ecc/ecc-overview",
  "/algorithms/ecc/ecdsa",
  "/algorithms/modes/ecb",
  "/algorithms/modes/cbc",
  "/algorithms/modes/cfb",
  "/algorithms/modes/ofb",
  "/algorithms/padding/pkcs7",
  "/algorithms/padding/ansi-x923",
  "/algorithms/padding/iso-7816",
  "/algorithms/encoding/base64",
  "/algorithms/encoding/hex",
  "/algorithms/encoding/binary",
  "/algorithms/tools/entropy-analyzer",
  "/algorithms/symmetric/aes-test-vectors",
  "/algorithms/hash/md5",
  "/algorithms/hash/sha1",
  "/algorithms/hash/sha3",
]);

export function getImplementationStatus(route: string): ImplementationStatus {
  if (webCryptoRoutes.has(route) || customRoutes.has(route)) return "Real";
  return "Substitute";
}

export function getBrowserSupport(route: string): BrowserSupport {
  if (webCryptoRoutes.has(route)) return "Web Crypto";
  if (customRoutes.has(route)) return "Custom TypeScript";
  return "Educational Substitute";
}

export function isFullyRealRoute(route: string) {
  return getImplementationStatus(route) === "Real";
}
