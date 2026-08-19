import { algorithmMetadata } from "./algorithmMetadata";
import { phaseOneAlgorithms, type PhaseOneAlgorithmContent, type PhaseOneDifficulty, type PhaseOneReference, type PhaseOneStatus } from "./phaseOneAlgorithmContent";
import { getBrowserSupport } from "./implementationStatus";
import type { AlgorithmMetadata, SecurityStatus } from "../types";

const reviewed = "2026-08-19";
const phaseOneRoutes = new Set(phaseOneAlgorithms.map((item) => item.route));

const references = {
  nistTransition: { label: "NIST SP 800-131A Rev. 2: algorithm transitions", url: "https://doi.org/10.6028/NIST.SP.800-131Ar2" },
  nistAes: { label: "NIST FIPS 197: Advanced Encryption Standard", url: "https://csrc.nist.gov/pubs/fips/197/final" },
  nistModes: { label: "NIST SP 800-38A: block cipher modes", url: "https://doi.org/10.6028/NIST.SP.800-38A" },
  nistGcm: { label: "NIST SP 800-38D: GCM and GMAC", url: "https://doi.org/10.6028/NIST.SP.800-38D" },
  nistHash: { label: "NIST FIPS 180-4: Secure Hash Standard", url: "https://doi.org/10.6028/NIST.FIPS.180-4" },
  nistSha3: { label: "NIST FIPS 202: SHA-3 Standard", url: "https://doi.org/10.6028/NIST.FIPS.202" },
  rfc8017: { label: "IETF RFC 8017: PKCS #1 RSA", url: "https://datatracker.ietf.org/doc/html/rfc8017" },
  rfc5869: { label: "IETF RFC 5869: HKDF", url: "https://datatracker.ietf.org/doc/html/rfc5869" },
  rfc8439: { label: "IETF RFC 8439: ChaCha20 and Poly1305", url: "https://datatracker.ietf.org/doc/html/rfc8439" },
  owaspPasswords: { label: "OWASP Password Storage Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
  webCrypto: { label: "MDN Web Crypto API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API" },
};

function idFromRoute(route: string) {
  return route.replace(/^\/algorithms\//, "").replace(/^\/demos\//, "demo/").replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "");
}

function phaseStatus(item: AlgorithmMetadata): PhaseOneStatus {
  const text = `${item.route} ${item.label}`.toLowerCase();
  if (item.securityStatus === "Unsafe") return "Broken";
  if (item.securityStatus === "Deprecated") return "Deprecated";
  if (item.securityStatus === "Legacy") return "Legacy";
  if (/padding|cbc|cfb|ofb|xts|rsa|certificate|wallet|ethereum|bcrypt|scrypt|argon2|hkdf|ripemd|idea|rc5|rc6/i.test(text)) return "Acceptable for specific use";
  if (item.securityStatus === "Modern") return "Recommended";
  return "Educational only";
}

function difficulty(item: AlgorithmMetadata): PhaseOneDifficulty {
  if (/rsa|ecc|curve|ecd|x25519|ed25519|certificate|pki|blockchain|sponge|argon2|scrypt|bcrypt|xts|padding|oracle/i.test(`${item.route} ${item.label}`)) return "Advanced";
  if (/aes|des|mode|hash|mac|kdf|finite|modular|discrete|primitive|twofish|serpent|camellia|blowfish|rc/i.test(`${item.route} ${item.label}`)) return "Intermediate";
  return "Beginner";
}

function analogy(category: string) {
  if (/math/i.test(category)) return "Like practicing the arithmetic rules that later algorithms quietly depend on.";
  if (/classical/i.test(category)) return "Like a hand-worked puzzle where every letter movement is visible.";
  if (/symmetric|block|stream/i.test(category)) return "Like a data-mixing machine controlled by key material and strict usage rules.";
  if (/mode/i.test(category)) return "Like instructions for safely using a block-cipher engine over a full message.";
  if (/public|elliptic|rsa/i.test(category)) return "Like a public mailbox system where public values and private secrets play different roles.";
  if (/hash/i.test(category)) return "Like a one-way fingerprint for data: easy to recompute, not something you decrypt.";
  if (/mac/i.test(category)) return "Like a tamper-evident seal that only someone with the shared secret can recreate.";
  if (/derivation|kdf/i.test(category)) return "Like a controlled key-making workshop that turns input material into purpose-specific key bytes.";
  if (/padding/i.test(category)) return "Like safely packaging data so a mathematical primitive receives the right shape of input.";
  if (/encoding/i.test(category)) return "Like changing the alphabet used to write bytes, without adding secrecy.";
  if (/certificate|pki/i.test(category)) return "Like an identity document chain where signatures and trust anchors must both be checked.";
  if (/attack|cryptanalysis/i.test(category)) return "Like a lab microscope for seeing what a cryptographic mistake leaks.";
  if (/blockchain/i.test(category)) return "Like a public ledger component where hashes, signatures, and keys support system rules.";
  return "Like a focused classroom model for one cryptography building block.";
}

function history(item: AlgorithmMetadata) {
  if (/classical/i.test(item.category)) return `${item.label} belongs to the pre-computer era of cryptography, where people could encrypt by hand and attackers often used language patterns.`;
  if (/aes/i.test(item.label)) return `${item.label} is connected to AES/Rijndael, the NIST-standardized block cipher used as a modern baseline.`;
  if (/des|triple/i.test(item.label)) return `${item.label} is part of the DES family, which is historically important but now mostly useful for migration and education.`;
  if (/hash|sha|md5|blake|keccak|ripemd/i.test(`${item.category} ${item.label}`)) return `${item.label} is part of the long evolution of hash functions used for integrity, signatures, identifiers, and protocol internals.`;
  if (/rsa|diffie|elgamal|rabin|ecc|ecd|ed25519|x25519/i.test(`${item.category} ${item.label}`)) return `${item.label} comes from public-key cryptography, where public information can be shared without revealing the private secret.`;
  if (/attack|cryptanalysis/i.test(item.category)) return `${item.label} is included as a defensive learning lab so students can see why modern recommendations exist.`;
  return `${item.label} is an important cryptography topic in this learning suite and is documented here as part of the Phase 2 expansion.`;
}

function avoidFor(item: AlgorithmMetadata) {
  const text = `${item.route} ${item.category} ${item.label}`.toLowerCase();
  if (/encoding/.test(text)) return ["Hiding secrets", "Replacing encryption", "Authentication or integrity by itself"];
  if (/attack|cryptanalysis/.test(text)) return ["Testing systems you do not own or administer", "Real password databases, accounts, wallets, networks, or hosts", "Operational exploitation"];
  if (/md5|sha-1|rc4|des|ecb|zero-padding|atbash|rot13|classical/.test(text)) return ["New security designs", "Real confidentiality or authentication", "Protecting sensitive user data"];
  if (/certificate|pki|csr|pem|der|wallet|ethereum|key-format|export/.test(text)) return ["Pasting production private keys or secrets", "Treating visual parsing as trust validation", "Replacing vetted security tooling"];
  if (/hash/.test(text)) return ["Encryption", "Password storage by itself", "Authentication without a secret key"];
  if (/kdf|pbkdf|bcrypt|scrypt|argon|hkdf/.test(text)) return ["Unreviewed parameter choices", "Storing real passwords in the demo", "Using derived bytes without purpose separation"];
  return ["Handwritten production cryptography", "Hardcoded secrets", "Ignoring mode, nonce, key, and authentication requirements"];
}

function purpose(item: AlgorithmMetadata) {
  if (/attack|cryptanalysis/i.test(item.category)) return `Explain the defensive lesson behind ${item.label}: what mistake enables it, what can leak, and how modern designs prevent it.`;
  if (/tool|encoding|export|saved|benchmark|random|entropy/i.test(item.category)) return `Help learners inspect supporting data, formats, randomness, or comparisons used around cryptographic systems.`;
  return item.intro;
}

function useCases(item: AlgorithmMetadata) {
  const base = item.notes.length ? [item.notes[0]] : [item.intro];
  if (/mode/i.test(item.category)) return ["Understanding message encryption structure", "Comparing IV, nonce, padding, and authentication rules", ...base];
  if (/attack|cryptanalysis/i.test(item.category)) return ["Safe classroom demonstrations", "Recognizing misuse patterns", "Choosing the modern prevention"];
  if (/encoding/i.test(item.category)) return ["Inspecting byte representations", "Debugging formats", "Learning what encoding is not"];
  if (/certificate|pki/i.test(item.category)) return ["Understanding identity and trust flows", "Inspecting certificate-shaped data safely", ...base];
  return [item.intro, "Comparing with related algorithms", "Guided beginner practice"];
}

function parameters(item: AlgorithmMetadata) {
  const fromInputs = item.inputs.filter((input) => /key|iv|nonce|salt|round|mode|block|curve|hash|cost|size|format|padding|counter|point|prime|modulus/i.test(input));
  return Array.from(new Set([...fromInputs, ...item.visualizers.slice(0, 2), "Clear demo-only boundary"])).slice(0, 5);
}

function keySizes(item: AlgorithmMetadata) {
  const text = `${item.route} ${item.label}`.toLowerCase();
  if (/aes-128/.test(text)) return ["128-bit AES key"];
  if (/aes-192/.test(text)) return ["192-bit AES key"];
  if (/aes-256/.test(text)) return ["256-bit AES key"];
  if (/aes|gcm|ctr|cbc|cfb|ofb|xts|cmac|gmac/.test(text)) return ["Uses AES-128, AES-192, or AES-256 depending on the selected example"];
  if (/des/.test(text)) return ["56 effective DES key bits; deprecated"];
  if (/rsa/.test(text)) return ["Toy examples use tiny numbers; real RSA commonly starts at 2048-bit modulus or stronger by policy"];
  if (/ecc|ecdh|ecdsa|ed25519|x25519|curve/.test(text)) return ["Curve-dependent; use vetted named curves only"];
  if (/hash|sha|md5|blake|keccak|ripemd/.test(text)) return ["No secret key for plain hashing; digest size depends on the hash"];
  if (/hmac|mac|poly1305/.test(text)) return ["Secret authentication keys must have enough entropy for the target strength"];
  if (/kdf|pbkdf|bcrypt|scrypt|argon|hkdf/.test(text)) return ["Output length and work factor depend on the chosen application policy"];
  if (/encoding|padding|attack|math|tool/.test(text)) return ["No production key size; this is a supporting concept or educational tool"];
  return ["Context-specific parameters; use vetted standards and libraries for production"];
}

function steps(item: AlgorithmMetadata) {
  if (item.visualizers.length >= 3) return item.visualizers.slice(0, 5);
  return [
    `Start with ${item.inputs[0] ?? "the demo input"}`,
    `Apply the ${item.label} transformation or inspection rule`,
    `Inspect ${item.outputs[0] ?? "the result"}`,
    "Compare the result with the security notes before using the idea elsewhere",
  ];
}

function securityProperties(item: AlgorithmMetadata) {
  const text = `${item.category} ${item.label}`.toLowerCase();
  if (/attack|cryptanalysis/.test(text)) return ["Shows a weakness or misuse pattern", "Provides prevention guidance instead of offensive automation"];
  if (/encoding|padding|tool|math/.test(text)) return ["Supporting concept", "Does not provide confidentiality by itself"];
  if (/hash/.test(text)) return ["One-way digest behavior", "Does not provide secrecy or authentication without the right construction"];
  if (/mac|hmac|cmac|poly1305|gmac/.test(text)) return ["Integrity", "Shared-key authentication"];
  if (/kdf|pbkdf|bcrypt|scrypt|argon|hkdf/.test(text)) return ["Key derivation", "Parameter-controlled work or domain separation"];
  if (/rsa|ecc|diffie|ecdh|x25519|ed25519|ecdsa|elgamal|rabin/.test(text)) return ["Public-key building block", "Requires protocol context for full security"];
  return ["Confidentiality when used correctly", "No automatic integrity unless an authenticated construction is used"];
}

function attacks(item: AlgorithmMetadata) {
  const text = `${item.route} ${item.label}`.toLowerCase();
  if (/attack|cryptanalysis|oracle|collision|factorization|brute-force|known-plaintext|nonce-reuse/.test(text)) return ["This page is itself a bounded defensive attack concept", "Misusing the demonstrated weakness against real systems is out of scope"];
  if (/ecb/.test(text)) return ["Pattern leakage", "Block rearrangement"];
  if (/cbc|padding/.test(text)) return ["Padding oracle when errors leak details", "Bit flipping without authentication"];
  if (/ctr|gcm|chacha|salsa|stream|nonce/.test(text)) return ["Nonce reuse", "Malleability without authentication"];
  if (/rsa/.test(text)) return ["Small key factorization", "Padding oracle", "Textbook RSA misuse"];
  if (/ecdsa|ed25519|signature/.test(text)) return ["Nonce bias or reuse", "Incorrect verification handling"];
  if (/hash|md5|sha1|sha|blake|keccak|ripemd/.test(text)) return ["Collision or preimage research depending on algorithm", "Brute force against weak inputs"];
  if (/kdf|password|bcrypt|scrypt|argon|pbkdf/.test(text)) return ["Offline dictionary guessing", "Weak work factors"];
  return ["Parameter misuse", "Implementation bugs", "Side-channel leakage in low-level code"];
}

function referencesFor(item: AlgorithmMetadata): PhaseOneReference[] {
  const text = `${item.route} ${item.category} ${item.label}`.toLowerCase();
  if (/aes|gcm|ctr|cbc|cfb|ofb|ecb|xts|cmac|gmac/.test(text)) return [references.nistAes, references.nistModes, references.nistGcm];
  if (/rsa|oaep|pss/.test(text)) return [references.rfc8017, references.nistTransition];
  if (/sha3|keccak/.test(text)) return [references.nistSha3, references.nistHash];
  if (/hash|sha|md5|blake|ripemd/.test(text)) return [references.nistHash, references.nistTransition];
  if (/chacha|poly1305|salsa/.test(text)) return [references.rfc8439];
  if (/hkdf|hmac/.test(text)) return [references.rfc5869];
  if (/password|pbkdf|bcrypt|scrypt|argon/.test(text)) return [references.owaspPasswords, references.webCrypto];
  return [references.nistTransition, references.webCrypto];
}

function supportFor(item: AlgorithmMetadata): PhaseOneAlgorithmContent["implementationSupport"] {
  const browser = getBrowserSupport(item.route);
  if (browser === "Web Crypto" || browser === "Custom TypeScript") return "Interactive in this app";
  if (/attack|visual|concept|certificate|pki|padding|wallet|ethereum|x25519|ed25519|argon2|bcrypt|scrypt/i.test(`${item.route} ${item.label}`)) return "Educational visualization only";
  return "Conceptual page with safe toy output";
}

function related(item: AlgorithmMetadata) {
  return algorithmMetadata
    .filter((candidate) => candidate.route !== item.route && candidate.category === item.category)
    .slice(0, 3)
    .map((candidate) => candidate.label);
}

function glossary(item: AlgorithmMetadata) {
  const text = `${item.category} ${item.label}`.toLowerCase();
  if (/encoding/.test(text)) return ["encoding", "bytes", "Base64", "hex", "binary"];
  if (/hash/.test(text)) return ["hash", "digest", "collision", "preimage", "avalanche effect"];
  if (/mac/.test(text)) return ["MAC", "tag", "authentication", "integrity", "secret key"];
  if (/kdf|password/.test(text)) return ["KDF", "salt", "work factor", "password hash", "verification"];
  if (/rsa|ecc|public|signature|certificate|pki/.test(text)) return ["public key", "private key", "signature", "certificate", "trust"];
  if (/mode|symmetric|stream|block/.test(text)) return ["plaintext", "ciphertext", "key", "nonce", "authentication tag"];
  if (/attack/.test(text)) return ["attacker model", "mistake", "exposure", "mitigation", "safe demo"];
  return ["algorithm", "input", "output", "parameter", "security status"];
}

function buildContent(item: AlgorithmMetadata): PhaseOneAlgorithmContent {
  const status = phaseStatus(item);
  const firstInput = item.inputs[0] ?? "demo input";
  const firstOutput = item.outputs[0] ?? "demo output";
  const safeWarning = status === "Recommended"
    ? "Use vetted APIs and keep the documented parameters correct."
    : status === "Acceptable for specific use"
      ? "Use only when the protocol, standard, or compatibility need specifically calls for it."
      : "Use only for learning, migration, or defensive analysis; do not treat this as modern protection.";

  return {
    id: idFromRoute(item.route),
    route: item.route,
    name: item.label,
    aliases: [],
    category: item.category,
    subcategory: item.category,
    securityStatus: status,
    appStatus: item.securityStatus as SecurityStatus,
    difficulty: difficulty(item),
    summary: item.intro,
    analogy: analogy(item.category),
    history: history(item),
    purpose: purpose(item),
    useCases: useCases(item),
    avoidFor: avoidFor(item),
    inputs: item.inputs,
    outputs: item.outputs,
    parameters: parameters(item),
    keySizes: keySizes(item),
    steps: steps(item),
    workedExample: {
      input: firstInput,
      parameters: parameters(item).slice(0, 3).join(", "),
      trace: [
        `Enter a small classroom value for ${firstInput}.`,
        `Run the page's ${item.label} model and inspect the visible intermediate state.`,
        `Compare ${firstOutput} with the safety boundary before applying the idea elsewhere.`,
      ],
      output: firstOutput,
      reversalOrVerification: /hash|digest/i.test(firstOutput) ? "Hashing is verified by recomputing the digest; it is not decrypted." : "Use the page's verification, inverse, or comparison panel where the algorithm supports one.",
    },
    pseudocode: [
      `input = collect(${item.inputs.slice(0, 3).join(", ") || "demo values"})`,
      `result = run${item.label.replace(/[^A-Za-z0-9]/g, "")}LearningModel(input)`,
      "show(result, warnings, intermediateSteps)",
    ],
    securityProperties: securityProperties(item),
    advantages: ["Fits the existing interactive route", "Connects beginner concepts to visible inputs and outputs"],
    limitations: ["Educational scope is narrower than a production cryptography library", "Security depends on context, parameters, and vetted implementations"],
    implementationMistakes: ["Ignoring the page's security badge", "Copying demo values into production", "Treating conceptual output as a standards-compliant implementation"],
    attacks: attacks(item),
    recommendation: safeWarning,
    relatedAlgorithms: related(item),
    glossary: glossary(item),
    quiz: [{
      question: `What should you check before using ${item.label} outside this learning page?`,
      options: [safeWarning, "Whether the output looks random enough on screen.", "Whether the algorithm name is familiar."],
      correctIndex: 0,
      explanation: "Cryptography choices depend on security status, parameters, implementation support, and protocol context.",
    }],
    references: referencesFor(item),
    implementationSupport: supportFor(item),
    lastReviewed: reviewed,
  };
}

export const phaseTwoAlgorithms = algorithmMetadata
  .filter((item) => !phaseOneRoutes.has(item.route))
  .map(buildContent);

export const allAlgorithmLearningContent = [...phaseOneAlgorithms, ...phaseTwoAlgorithms];
export const allAlgorithmLearningContentByRoute = Object.fromEntries(allAlgorithmLearningContent.map((item) => [item.route, item]));

export function findAlgorithmLearningContent(route: string) {
  return allAlgorithmLearningContentByRoute[route];
}
