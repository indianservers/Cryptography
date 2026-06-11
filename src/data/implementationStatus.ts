import type { BrowserSupport, ImplementationStatus } from "../types";

const webCryptoRoutes = new Set([
  "/algorithms/symmetric/aes",
  "/algorithms/modes/ctr",
  "/algorithms/modes/gcm",
  "/algorithms/hash/sha2",
  "/algorithms/hash/sha-256-step",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/tools/benchmark",
  "/algorithms/tools/audit",
  "/algorithms/tools/test-vectors",
  "/algorithms/tools/random-bytes",
]);

const customRoutes = new Set([
  "/algorithms/math/primes",
  "/algorithms/math/modular-arithmetic",
  "/algorithms/math/euclidean-algorithm",
  "/algorithms/math/finite-fields",
  "/algorithms/math/chinese-remainder",
  "/algorithms/math/discrete-logarithm",
  "/algorithms/math/primitive-roots",
  "/algorithms/math/gf256",
  "/algorithms/math/elliptic-curve-points",
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
  "/algorithms/symmetric/triple-des",
  "/algorithms/symmetric/blowfish",
  "/algorithms/symmetric/rc5",
  "/algorithms/symmetric/twofish",
  "/algorithms/symmetric/serpent",
  "/algorithms/symmetric/idea",
  "/algorithms/symmetric/rc6",
  "/algorithms/symmetric/camellia",
  "/algorithms/stream/chacha20",
  "/algorithms/stream/salsa20",
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
  "/algorithms/attacks/frequency-analysis",
  "/algorithms/attacks/caesar-brute-force",
  "/algorithms/attacks/ecb-pattern-leakage",
  "/algorithms/attacks/rsa-small-exponent",
  "/algorithms/attacks/rsa-factorization-demo",
  "/algorithms/attacks/hash-collision-demo",
  "/algorithms/attacks/nonce-reuse",
  "/algorithms/attacks/xor-known-plaintext",
  "/algorithms/tools/entropy-analyzer",
  "/algorithms/symmetric/aes-test-vectors",
  "/algorithms/hash/md5",
  "/algorithms/hash/sha1",
  "/algorithms/hash/sha3",
  "/algorithms/hash/keccak-sponge",
  "/algorithms/hash/blake2",
  "/algorithms/hash/blake3",
  "/algorithms/hash/ripemd160",
  "/algorithms/mac/cmac",
  "/algorithms/mac/poly1305",
  "/algorithms/mac/gmac",
  "/algorithms/blockchain/merkle-tree",
  "/algorithms/blockchain/wallet-key-pair",
]);

const mixedRoutes = new Set([
  "/algorithms/attacks/reserve-hash",
]);

export function getImplementationStatus(route: string): ImplementationStatus {
  if (webCryptoRoutes.has(route) || customRoutes.has(route) || mixedRoutes.has(route)) return "Real";
  return "Substitute";
}

export function getBrowserSupport(route: string): BrowserSupport {
  if (webCryptoRoutes.has(route)) return "Web Crypto";
  if (customRoutes.has(route)) return "Custom TypeScript";
  if (mixedRoutes.has(route)) return "Mixed";
  return "Educational Substitute";
}

export function isFullyRealRoute(route: string) {
  return getImplementationStatus(route) === "Real";
}
