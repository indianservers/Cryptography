import type { AnimationSequence } from "../lib/animationSteps";
import type { ByteCell } from "../components/visual/AnimatedByteGrid";
import type { DistributionBar } from "../components/visual/AnimatedDistributionBars";
import type { FlowEdge, FlowNode } from "../components/visual/AnimatedFlowDiagram";
import type { LetterMapping } from "../components/visual/AnimatedAlphabetMap";
import type { ModuloJump } from "../components/visual/AnimatedNumberLineModulo";
import type { TreeNode } from "../components/visual/AnimatedTreeBuild";

export type AnimationVisualType = "flow" | "byte-grid" | "alphabet-map" | "matrix" | "tree" | "modulo" | "distribution";

export interface ModuleAnimationVisualMapping {
  nodes?: FlowNode[];
  edges?: FlowEdge[];
  cells?: ByteCell[];
  chunkSize?: number;
  sourceAlphabet?: string;
  targetAlphabet?: string;
  mappings?: LetterMapping[];
  inputMatrix?: string[][];
  operationMatrix?: string[][];
  outputMatrix?: string[][];
  levels?: TreeNode[][];
  rootId?: string;
  modulus?: number;
  currentValue?: number;
  jumps?: ModuloJump[];
  bars?: DistributionBar[];
  benchmarkLine?: number;
  caption?: string;
}

export interface ModuleAnimationContent {
  route: string;
  animationType: AnimationVisualType;
  sequence: AnimationSequence;
  visualMapping: ModuleAnimationVisualMapping;
  safetyNote?: string;
}

export const requiredPhase5AnimationRoutes = [
  "/algorithms/classical/caesar-cipher",
  "/algorithms/classical/vigenere-cipher",
  "/algorithms/asymmetric/diffie-hellman",
  "/algorithms/asymmetric/rsa-encryption",
  "/algorithms/asymmetric/rsa-decryption",
  "/algorithms/asymmetric/rsa-key-generation",
  "/algorithms/hash/sha-256-step",
  "/algorithms/hash/sha3",
  "/algorithms/encoding/base64",
  "/algorithms/encoding/hex",
  "/algorithms/encoding/binary",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/math/modular-arithmetic",
  "/algorithms/math/gf256",
  "/algorithms/symmetric/aes-mix-columns",
  "/algorithms/symmetric/aes-key-expansion",
  "/algorithms/blockchain/merkle-tree",
  "/algorithms/tools/random-bytes",
  "/algorithms/tools/entropy-analyzer",
] as const;

function sequence(id: string, title: string, stepTitles: string[], reducedMotionSummary: string, exactnessNote?: string): AnimationSequence {
  return {
    id,
    title,
    reducedMotionSummary,
    exactnessNote,
    steps: stepTitles.map((stepTitle, index) => ({
      id: `${id}-step-${index + 1}`,
      title: stepTitle,
      description: `${stepTitle}. The animation highlights this stage so learners can connect the current input, transformation, and output without relying on motion alone.`,
      durationMs: 1300,
    })),
  };
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const caesarTarget = "DEFGHIJKLMNOPQRSTUVWXYZABC";
const atozMappings = alphabet.split("").map((source, index) => ({ source, target: caesarTarget[index], label: `${source} + shift 3 wraps to ${caesarTarget[index]}` }));
const sampleBytes: ByteCell[] = [
  { id: "b1", label: "Byte 1", value: "01001101", group: "M" },
  { id: "b2", label: "Byte 2", value: "01100001", group: "a" },
  { id: "b3", label: "Byte 3", value: "01101110", group: "n" },
  { id: "g1", label: "6-bit", value: "010011", group: "T" },
  { id: "g2", label: "6-bit", value: "010110", group: "W" },
  { id: "g3", label: "6-bit", value: "000101", group: "F" },
  { id: "g4", label: "6-bit", value: "101110", group: "u" },
];

function flowEntry(route: string, title: string, steps: string[], nodes: FlowNode[], edges: FlowEdge[], exactnessNote?: string, safetyNote?: string): ModuleAnimationContent {
  return {
    route,
    animationType: "flow",
    sequence: sequence(route, title, steps, `${title} can be read as the ordered list: ${steps.join(", ")}.`, exactnessNote),
    visualMapping: { nodes, edges },
    safetyNote,
  };
}

export const moduleAnimationContent: Record<string, ModuleAnimationContent> = {
  "/algorithms/classical/caesar-cipher": {
    route: "/algorithms/classical/caesar-cipher",
    animationType: "alphabet-map",
    sequence: sequence("caesar-shift", "Caesar letter shift", ["Plain letter index", "Add shift", "Wrap modulo 26", "Output cipher letter", "Repeat for the message"], "Static view lists the selected letter, the shift, the modulo wrap, and the output mapping.", "Exact classroom Caesar over A-Z only; unsafe for real secrecy."),
    visualMapping: { sourceAlphabet: alphabet, targetAlphabet: caesarTarget, mappings: atozMappings, modulus: 26, currentValue: 3, jumps: [{ from: 0, to: 3, label: "A shifted by 3 becomes D" }] },
  },
  "/algorithms/classical/vigenere-cipher": {
    route: "/algorithms/classical/vigenere-cipher",
    animationType: "alphabet-map",
    sequence: sequence("vigenere-key", "Vigenere per-letter shift", ["Repeat keyword", "Convert key letters to shifts", "Apply character shifts", "Reveal ciphertext", "Notice periodic leakage"], "Static view shows the repeated key and each character-level Caesar shift.", "Educational classical cipher; repeated keys can leak patterns."),
    visualMapping: { sourceAlphabet: alphabet, targetAlphabet: "LmnopqrstuvwxyzABCDEFGHIJK".toUpperCase().slice(0, 26), mappings: [{ source: "A", target: "L", label: "Key L means shift 11" }, { source: "T", target: "E", label: "T + L wraps to E" }] },
  },
  "/algorithms/asymmetric/diffie-hellman": flowEntry("/algorithms/asymmetric/diffie-hellman", "Diffie-Hellman exchange", ["Public p and g", "Alice private exponent", "Bob private exponent", "Public values exchanged", "Shared secret matches", "MITM warning"], [
    { id: "params", label: "Public p,g" }, { id: "alice", label: "Alice secret a" }, { id: "bob", label: "Bob secret b" }, { id: "exchange", label: "Exchange A and B" }, { id: "secret", label: "Same shared secret" }, { id: "mitm", label: "Authenticate peers" },
  ], [
    { id: "a-public", from: "alice", to: "exchange", label: "g^a mod p" }, { id: "b-public", from: "bob", to: "exchange", label: "g^b mod p" }, { id: "shared", from: "exchange", to: "secret", label: "g^(ab) mod p" },
  ], "Toy-number visualization. Real Diffie-Hellman must authenticate the peer."),
  "/algorithms/asymmetric/rsa-encryption": flowEntry("/algorithms/asymmetric/rsa-encryption", "RSA encryption flow", ["Message integer", "Public key e,n", "Modular exponentiation", "Cipher integer", "Padding warning"], [
    { id: "message", label: "Message m" }, { id: "public", label: "Public key (e,n)" }, { id: "pow", label: "m^e mod n" }, { id: "cipher", label: "Cipher c" }, { id: "padding", label: "Use OAEP in real systems" },
  ], [{ id: "encrypt", from: "message", to: "pow" }, { id: "key", from: "public", to: "pow" }, { id: "out", from: "pow", to: "cipher" }], "Raw RSA arithmetic is educational only; padding is required for real encryption."),
  "/algorithms/asymmetric/rsa-decryption": flowEntry("/algorithms/asymmetric/rsa-decryption", "RSA decryption flow", ["Cipher integer", "Private exponent d", "Modular exponentiation", "Recovered message", "Side-channel warning"], [
    { id: "cipher", label: "Cipher c" }, { id: "private", label: "Private d" }, { id: "pow", label: "c^d mod n" }, { id: "message", label: "Recovered m" }, { id: "side", label: "Constant-time needed" },
  ], [{ id: "decrypt", from: "cipher", to: "pow" }, { id: "secret", from: "private", to: "pow" }, { id: "recover", from: "pow", to: "message" }], "Toy arithmetic only; real private-key operations require vetted constant-time implementations."),
  "/algorithms/asymmetric/rsa-key-generation": flowEntry("/algorithms/asymmetric/rsa-key-generation", "RSA key generation", ["Select toy primes", "Compute n", "Compute phi", "Choose e", "Compute d inverse", "Relate public/private keys"], [
    { id: "primes", label: "p and q" }, { id: "n", label: "n = p*q" }, { id: "phi", label: "phi(n)" }, { id: "e", label: "public e" }, { id: "d", label: "private d" }, { id: "keys", label: "Key pair" },
  ], [{ id: "n-edge", from: "primes", to: "n" }, { id: "phi-edge", from: "primes", to: "phi" }, { id: "d-edge", from: "e", to: "d" }, { id: "keys-edge", from: "d", to: "keys" }], "Toy primes explain the relationship; production key generation must use vetted APIs."),
  "/algorithms/hash/sha-256-step": {
    route: "/algorithms/hash/sha-256-step",
    animationType: "byte-grid",
    sequence: sequence("sha256-flow", "SHA-256 message flow", ["UTF-8 bytes", "Padding", "Message schedule", "Compression rounds", "Digest", "Avalanche observation"], "Static view lists bytes, padding, schedule, compression, digest, and avalanche observation.", "SHA-256 digest behavior is Web Crypto/vector-backed elsewhere; this animation samples the structure."),
    visualMapping: { cells: sampleBytes, chunkSize: 8, caption: "Showing a small sample of the message bytes and grouped working values." },
  },
  "/algorithms/hash/sha3": flowEntry("/algorithms/hash/sha3", "SHA-3 sponge flow", ["Absorb input", "Permute state", "Squeeze digest", "Rate/capacity note"], [
    { id: "absorb", label: "Absorb" }, { id: "permute", label: "Keccak-f permutation" }, { id: "squeeze", label: "Squeeze" }, { id: "rate", label: "Rate/capacity boundary" },
  ], [{ id: "a-p", from: "absorb", to: "permute" }, { id: "p-s", from: "permute", to: "squeeze" }], "Structure animation only; exact SHA-3 support depends on the page implementation."),
  "/algorithms/encoding/base64": {
    route: "/algorithms/encoding/base64",
    animationType: "byte-grid",
    sequence: sequence("base64-groups", "Base64 byte grouping", ["3 input bytes", "24 bits", "Four 6-bit groups", "Map to Base64 alphabet", "Padding note"], "Static view shows the 3-byte, 24-bit, 6-bit grouping and optional padding rule.", "Base64 is exact encoding, not encryption."),
    visualMapping: { cells: sampleBytes, chunkSize: 4, caption: "Example: Man becomes TWFu by regrouping bits." },
  },
  "/algorithms/encoding/hex": {
    route: "/algorithms/encoding/hex",
    animationType: "byte-grid",
    sequence: sequence("hex-nibbles", "Hex byte split", ["Byte", "High nibble", "Low nibble", "Two hex symbols"], "Static view shows each byte split into two four-bit nibbles.", "Hex is exact encoding, not encryption."),
    visualMapping: { cells: [{ id: "byte", label: "Byte", value: "01001101", group: "M" }, { id: "hi", label: "High", value: "0100", group: "4" }, { id: "lo", label: "Low", value: "1101", group: "D" }], chunkSize: 3 },
  },
  "/algorithms/encoding/binary": {
    route: "/algorithms/encoding/binary",
    animationType: "byte-grid",
    sequence: sequence("binary-byte", "Binary byte rows", ["Character", "UTF-8 byte", "8-bit representation", "Grouping note"], "Static view shows character to byte to bits.", "Binary is exact representation, not encryption."),
    visualMapping: { cells: [{ id: "char", label: "Char", value: "A" }, { id: "byte", label: "Byte", value: "65" }, { id: "bits", label: "Bits", value: "01000001" }], chunkSize: 3 },
  },
  "/algorithms/mac/hmac": flowEntry("/algorithms/mac/hmac", "HMAC inner and outer flow", ["Normalize key block", "ipad XOR", "Inner hash", "opad XOR", "Outer hash", "Final tag"], [
    { id: "key", label: "Key block" }, { id: "ipad", label: "K xor ipad" }, { id: "inner", label: "Inner hash" }, { id: "opad", label: "K xor opad" }, { id: "outer", label: "Outer hash" }, { id: "tag", label: "Tag" },
  ], [{ id: "key-ipad", from: "key", to: "ipad" }, { id: "ipad-inner", from: "ipad", to: "inner" }, { id: "key-opad", from: "key", to: "opad" }, { id: "opad-outer", from: "opad", to: "outer" }, { id: "outer-tag", from: "outer", to: "tag" }], "HMAC authenticates and checks integrity; it does not encrypt message contents."),
  "/algorithms/kdf/pbkdf2": flowEntry("/algorithms/kdf/pbkdf2", "PBKDF2 work factor", ["Password and salt", "First HMAC", "Repeat iterations", "XOR blocks", "Derived key", "Iteration-cost note"], [
    { id: "password", label: "Password" }, { id: "salt", label: "Salt" }, { id: "hmac", label: "HMAC loop" }, { id: "repeat", label: "Iterations" }, { id: "key", label: "Derived key" },
  ], [{ id: "p-h", from: "password", to: "hmac" }, { id: "s-h", from: "salt", to: "hmac" }, { id: "h-r", from: "hmac", to: "repeat" }, { id: "r-k", from: "repeat", to: "key" }], "Do not paste production passwords into educational tools."),
  "/algorithms/math/modular-arithmetic": {
    route: "/algorithms/math/modular-arithmetic",
    animationType: "modulo",
    sequence: sequence("modular-wrap", "Modulo wraparound", ["Input value", "Divide by modulus", "Take remainder", "Wrap on number line", "Inverse or power note"], "Static view lists the arithmetic and highlights the final remainder.", "Small modulus examples are for learning."),
    visualMapping: { modulus: 12, currentValue: 5, jumps: [{ from: 9, to: 2, label: "+5 wraps around mod 12" }], caption: "Clock-style modular arithmetic." },
  },
  "/algorithms/math/gf256": {
    route: "/algorithms/math/gf256",
    animationType: "matrix",
    sequence: sequence("gf256-multiply", "GF(2^8) byte multiply", ["Byte operands", "Shift/XOR multiply", "Polynomial reduction", "AES field result"], "Static view shows operands, XOR/shift stages, reduction, and result.", "Exact field arithmetic depends on the page helper; this animation shows the structure."),
    visualMapping: { inputMatrix: [["57"], ["83"]], operationMatrix: [["shift"], ["xor"], ["reduce"]], outputMatrix: [["c1"]], caption: "GF(2^8) treats bytes as polynomials." },
  },
  "/algorithms/symmetric/aes-mix-columns": {
    route: "/algorithms/symmetric/aes-mix-columns",
    animationType: "matrix",
    sequence: sequence("aes-mixcolumns", "AES MixColumns matrix", ["AES column", "GF multiplication", "XOR combine", "Output column"], "Static view shows the fixed matrix, one input column, and output column.", "AES MixColumns column arithmetic has vector-backed educational coverage."),
    visualMapping: { inputMatrix: [["db"], ["13"], ["53"], ["45"]], operationMatrix: [["02", "03", "01", "01"], ["01", "02", "03", "01"], ["01", "01", "02", "03"], ["03", "01", "01", "02"]], outputMatrix: [["8e"], ["4d"], ["a1"], ["bc"]], caption: "FIPS-style sample column transformation." },
  },
  "/algorithms/symmetric/aes-key-expansion": flowEntry("/algorithms/symmetric/aes-key-expansion", "AES key expansion", ["Initial key words", "RotWord", "SubWord", "Rcon XOR", "New word", "Round key boundary"], [
    { id: "initial", label: "Initial words" }, { id: "rot", label: "RotWord" }, { id: "sub", label: "SubWord" }, { id: "rcon", label: "Rcon XOR" }, { id: "new", label: "New word" }, { id: "round", label: "Round key" },
  ], [{ id: "i-r", from: "initial", to: "rot" }, { id: "r-s", from: "rot", to: "sub" }, { id: "s-c", from: "sub", to: "rcon" }, { id: "c-n", from: "rcon", to: "new" }, { id: "n-round", from: "new", to: "round" }], "AES-128 key expansion has vector-backed educational coverage; round keys are derived secrets."),
  "/algorithms/blockchain/merkle-tree": {
    route: "/algorithms/blockchain/merkle-tree",
    animationType: "tree",
    sequence: sequence("merkle-build", "Merkle tree build", ["Leaves", "Pair hash", "Next level", "Root", "Proof path concept"], "Static view shows leaves, pair hashing, parent level, root, and proof path concept.", "Conceptual tree construction; exact hashing depends on page implementation."),
    visualMapping: { levels: [[{ id: "l1", label: "Leaf 1" }, { id: "l2", label: "Leaf 2" }, { id: "l3", label: "Leaf 3" }, { id: "l4", label: "Leaf 4" }], [{ id: "p1", label: "Hash pair 1" }, { id: "p2", label: "Hash pair 2" }], [{ id: "root", label: "Merkle root" }]], rootId: "root" },
  },
  "/algorithms/tools/random-bytes": {
    route: "/algorithms/tools/random-bytes",
    animationType: "distribution",
    sequence: sequence("random-buckets", "Random byte distribution", ["Generated bytes", "Bucket distribution", "Unpredictability note", "Patternless-looking warning"], "Static view shows generated sample buckets and the warning that random is not judged by appearance alone.", "Use Web Crypto randomness where the page indicates browser-backed generation."),
    visualMapping: { bars: [{ id: "0", label: "0x0", value: 9 }, { id: "1", label: "0x1", value: 7 }, { id: "2", label: "0x2", value: 11 }, { id: "3", label: "0x3", value: 8 }], benchmarkLine: 8, caption: "Sample high-nibble bucket counts." },
  },
  "/algorithms/tools/entropy-analyzer": {
    route: "/algorithms/tools/entropy-analyzer",
    animationType: "distribution",
    sequence: sequence("entropy-counts", "Entropy distribution", ["Count symbols", "Compute distribution", "Estimate entropy", "Interpret carefully"], "Static view shows symbol counts, distribution, entropy estimate, and interpretation warning.", "Entropy estimates are guidance, not a proof of password strength."),
    visualMapping: { bars: [{ id: "letters", label: "Letters", value: 12 }, { id: "digits", label: "Digits", value: 4 }, { id: "symbols", label: "Symbols", value: 2 }], benchmarkLine: 6, caption: "Example category distribution." },
  },
};

export const moduleAnimationEntries = Object.values(moduleAnimationContent).sort((left, right) => left.route.localeCompare(right.route));

export function getModuleAnimationContent(route: string) {
  return moduleAnimationContent[route];
}
