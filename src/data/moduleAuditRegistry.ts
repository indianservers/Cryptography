import { algorithmMetadata } from "./algorithmMetadata";
import { navigationItems } from "./navigation";
import type {
  BrowserSupportStatus,
  ImplementationAccuracy,
  SecurityUseStatus,
  VerificationStatus,
} from "../lib/auditStatus";

export type AuditPriority = "P0" | "P1" | "P2" | "P3";
export type CurrentPageType = "custom" | "generic-shell" | "demo" | "tool" | "unknown";
export type Phase2Decision = "exact-educational" | "conceptual-only" | "hybrid-exact-core" | "deferred-needs-library" | "not-p0";

export interface ModuleAuditEntry {
  id: string;
  title: string;
  route: string;
  category: string;
  currentPageType: CurrentPageType;
  implementationAccuracy: ImplementationAccuracy;
  securityUseStatus: SecurityUseStatus;
  verificationStatus: VerificationStatus;
  browserSupportStatus: BrowserSupportStatus;
  priority: AuditPriority;
  phase2Decision: Phase2Decision;
  phaseTarget: number;
  mainRisk: string;
  requiredFix: string;
  requiredTests: string[];
  notes: string;
}

const p0NeedExpert = new Set([
  "/algorithms/asymmetric/rsa-padding",
  "/algorithms/padding/oaep",
  "/algorithms/padding/pss",
  "/algorithms/attacks/ecdsa-nonce-reuse",
  "/algorithms/attacks/padding-oracle-concept",
  "/algorithms/blockchain/ethereum-signature",
  "/algorithms/blockchain/bitcoin-hashing",
  "/algorithms/ecc/curve-explorer",
  "/algorithms/ecc/ecdh",
  "/algorithms/ecc/ed25519",
  "/algorithms/ecc/x25519",
  "/algorithms/kdf/argon2",
  "/algorithms/kdf/bcrypt",
  "/algorithms/kdf/hkdf",
  "/algorithms/kdf/scrypt",
  "/algorithms/modes/xts",
  "/algorithms/pki/x509-certificate-viewer",
  "/algorithms/pki/certificate-chain",
  "/algorithms/pki/csr-viewer",
  "/algorithms/blockchain/wallet-key-pair",
  "/algorithms/tools/key-format-converter",
  "/algorithms/tools/export-center",
  "/algorithms/symmetric/aes-key-expansion",
  "/algorithms/symmetric/aes-mix-columns",
  "/algorithms/symmetric/aes-modes",
  "/algorithms/symmetric/des-key-schedule",
  "/algorithms/classical/hill-cipher",
  "/algorithms/classical/playfair-cipher",
  "/algorithms/classical/columnar-transposition",
  "/algorithms/classical/affine-cipher",
  "/algorithms/classical/rail-fence",
  "/algorithms/classical/substitution-cipher",
]);

const p1Routes = new Set([
  "/algorithms/attacks/ecb-pattern-leakage",
  "/algorithms/classical/atbash",
  "/algorithms/classical/rot13",
  "/algorithms/hash/md5",
  "/algorithms/hash/sha1",
  "/algorithms/symmetric/des",
  "/algorithms/symmetric/des-full-step",
  "/algorithms/attacks/caesar-brute-force",
  "/demos/caesar",
]);

const p2Routes = new Set([
  "/algorithms/hash/blake2",
  "/algorithms/hash/blake3",
  "/algorithms/hash/keccak-sponge",
  "/algorithms/hash/ripemd160",
  "/algorithms/mac/cmac",
  "/algorithms/mac/gmac",
  "/algorithms/mac/poly1305",
  "/algorithms/blockchain/merkle-tree",
  "/algorithms/symmetric/camellia",
  "/algorithms/symmetric/idea",
  "/algorithms/symmetric/rc6",
  "/algorithms/symmetric/serpent",
  "/algorithms/symmetric/twofish",
  "/algorithms/stream/salsa20",
]);

const officialVectorRoutes = new Set([
  "/algorithms/encoding/base64",
  "/algorithms/encoding/hex",
  "/algorithms/encoding/binary",
  "/algorithms/classical/caesar-cipher",
  "/algorithms/classical/rot13",
  "/algorithms/classical/atbash",
  "/algorithms/hash/sha2",
  "/algorithms/hash/sha-256-step",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/tools/test-vectors",
  "/algorithms/symmetric/aes-test-vectors",
  "/demos/base64",
  "/demos/sha256",
  "/demos/sha512",
  "/demos/hmac-sha256",
  "/demos/pbkdf2",
  "/demos/aes",
]);

const webCryptoRoutes = new Set([
  "/algorithms/symmetric/aes",
  "/algorithms/hash/sha2",
  "/algorithms/hash/sha-256-step",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/modes/ctr",
  "/algorithms/modes/gcm",
  "/algorithms/tools/random-bytes",
  "/algorithms/tools/benchmark",
  "/algorithms/tools/test-vectors",
  "/demos/sha1",
  "/demos/sha256",
  "/demos/sha512",
  "/demos/hmac-sha256",
  "/demos/pbkdf2",
  "/demos/aes",
]);

const phase2P0Overrides: Record<string, Partial<ModuleAuditEntry>> = {
  "/algorithms/classical/affine-cipher": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed exact A-Z Affine educational implementation with multiplier validation, modular inverse, encrypt/decrypt, and tests.",
    requiredTests: ["Affine known-answer vector", "Invalid multiplier test", "Round-trip test", "Route smoke test"],
    notes: "Exact for classroom A-Z Affine cipher; still unsafe for real confidentiality.",
  },
  "/algorithms/classical/columnar-transposition": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed stable-keyword columnar transposition helper and page wiring.",
    requiredTests: ["Duplicate-key stable order test", "Round-trip grid test", "Route smoke test"],
    notes: "Exact for normalized A-Z text with the documented padding convention.",
  },
  "/algorithms/classical/rail-fence": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed exact zig-zag rail fence encrypt/decrypt helper and page wiring.",
    requiredTests: ["Standard 3-rail sample", "Invalid rail count test", "Round-trip test"],
    notes: "Exact for the standard zig-zag rail fence path.",
  },
  "/algorithms/classical/substitution-cipher": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed validated monoalphabetic substitution helper and page wiring.",
    requiredTests: ["Known mapping test", "Duplicate alphabet rejection", "Round-trip test"],
    notes: "Exact for 26-letter substitution alphabets with punctuation/case preservation.",
  },
  "/algorithms/classical/playfair-cipher": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed Playfair I/J-merge square, digraph preparation, and encrypt rules.",
    requiredTests: ["Known Playfair sample", "Repeated-letter filler test", "Odd length padding test"],
    notes: "Exact for the documented 5x5 I/J-merge and X-filler convention.",
  },
  "/algorithms/classical/hill-cipher": {
    currentPageType: "custom",
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "UNSAFE",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Completed 2x2 Hill encryption helper with determinant invertibility validation.",
    requiredTests: ["2x2 known sample", "Invalid determinant rejection", "Route smoke test"],
    notes: "Exact for 2x2 A-Z Hill encryption; larger matrices remain future work.",
  },
  "/algorithms/symmetric/aes-mix-columns": {
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "EDUCATIONAL_ONLY",
    verificationStatus: "HAS_OFFICIAL_TEST_VECTORS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Verified exact AES GF(2^8) MixColumns column arithmetic with FIPS sample.",
    requiredTests: ["FIPS-197 MixColumns sample", "Route smoke test"],
    notes: "Exact for AES column arithmetic; not a full encryption page.",
  },
  "/algorithms/symmetric/aes-key-expansion": {
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "SECRET_INPUT_RISK",
    verificationStatus: "HAS_OFFICIAL_TEST_VECTORS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "exact-educational",
    requiredFix: "Verified AES-128 key expansion round-key output with known vector; AES-192/256 remain UI-supported but need expanded official test coverage.",
    requiredTests: ["AES-128 key expansion known vector", "Secret-input warning visibility", "Route smoke test"],
    notes: "Round keys are derived secrets; do not log production key material.",
  },
  "/algorithms/kdf/hkdf": {
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "SECRET_INPUT_RISK",
    verificationStatus: "HAS_OFFICIAL_TEST_VECTORS",
    browserSupportStatus: "WEB_CRYPTO",
    phase2Decision: "exact-educational",
    requiredFix: "Added RFC 5869-compatible HKDF-SHA256 helper using Web Crypto HMAC and test vector.",
    requiredTests: ["RFC 5869 test case 1", "Secret-input warning visibility", "Route smoke test"],
    notes: "Exact HKDF-SHA256 helper exists; page remains educational and must not ask for production secrets.",
  },
  "/algorithms/blockchain/bitcoin-hashing": {
    implementationAccuracy: "EXACT_EDUCATIONAL",
    securityUseStatus: "EDUCATIONAL_ONLY",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "WEB_CRYPTO",
    phase2Decision: "hybrid-exact-core",
    requiredFix: "Added exact double SHA-256 helper test for controlled bytes; full block-header serialization/mining remains conceptual.",
    requiredTests: ["Double SHA-256 helper test", "Route smoke test"],
    notes: "Double-hash helper is exact; block header endianness, compact target, and mining comparison remain conceptual unless separately tested.",
  },
  "/algorithms/encoding/pem-der": {
    implementationAccuracy: "CONCEPTUAL_PREVIEW",
    securityUseStatus: "SECRET_INPUT_RISK",
    verificationStatus: "HAS_BASIC_UNIT_TESTS",
    browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC",
    phase2Decision: "hybrid-exact-core",
    requiredFix: "Added basic PEM block extraction test; strict ASN.1 and certificate validation remain out of scope.",
    requiredTests: ["PEM block extraction test", "Secret-input warning visibility", "Route smoke test"],
    notes: "Basic local structure viewer only; does not validate certificates or parse full ASN.1.",
  },
  "/algorithms/asymmetric/rsa-padding": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as RSA padding structure visualizer; do not claim OAEP/PSS exact encoding until MGF1, hash, salt, length, and validation vectors exist.", notes: "Raw RSA is unsafe; OAEP/PSS details are conceptual until vectors are added." },
  "/algorithms/padding/oaep": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as OAEP structure visualizer; exact encoding requires tested MGF1, label hash, seed mask, DB mask, and length checks.", notes: "Conceptual OAEP layout only; not standards-compliant ciphertext padding output." },
  "/algorithms/padding/pss": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as PSS structure visualizer; exact signature encoding requires tested salt, MGF1, trailer, and verification rules.", notes: "Conceptual PSS layout only; not standards-compliant signature output." },
  "/algorithms/attacks/ecdsa-nonce-reuse": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "ATTACK_CONCEPT_ONLY", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep bounded to toy arithmetic and defensive nonce guidance; do not target real signatures.", notes: "Toy formula demonstration only; use deterministic/nonbiased nonces in real ECDSA." },
  "/algorithms/attacks/padding-oracle-concept": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "ATTACK_CONCEPT_ONLY", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as defensive concept page explaining uniform errors and authenticated encryption; no exploit workflow.", notes: "Attack concept for authorized learning only." },
  "/algorithms/ecc/curve-explorer": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "EDUCATIONAL_ONLY", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC", requiredFix: "Treat small finite-field point math as toy exact arithmetic; do not imply standard curve support.", notes: "Small fields make patterns visible; never invent production curves." },
  "/algorithms/ecc/ecdh": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as toy/shared-secret concept unless P-256/X25519 Web Crypto or vetted library support is added.", notes: "Toy key agreement only; not X25519 or P-256 correctness." },
  "/algorithms/ecc/ed25519": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual deterministic signature flow; exact Ed25519 needs Web Crypto support or vetted library with vectors.", notes: "Do not output fake signatures as real Ed25519 signatures." },
  "/algorithms/ecc/x25519": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual key-agreement flow; exact X25519 needs Web Crypto support or vetted library with vectors.", notes: "X25519 is key agreement, not signatures; no fake shared secrets." },
  "/algorithms/kdf/argon2": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual parameter and memory/time page; exact Argon2 requires vetted WASM/library and vectors.", notes: "Browser Web Crypto does not provide Argon2." },
  "/algorithms/kdf/bcrypt": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual hash-format and cost page; exact bcrypt requires vetted implementation and vectors.", notes: "Do not output production bcrypt hashes without library-backed tests." },
  "/algorithms/kdf/scrypt": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual N/r/p memory-cost page; exact scrypt requires vetted implementation and vectors.", notes: "Browser Web Crypto does not provide scrypt." },
  "/algorithms/modes/xts": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual tweakable storage-mode page; exact XTS requires tested AES-XTS implementation and storage-sector vectors.", notes: "XTS is for disk sectors, not general message encryption." },
  "/algorithms/symmetric/aes-modes": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep mode comparison conceptual except specific Web Crypto-backed modes elsewhere; warn on ECB and nonce reuse.", notes: "Modes determine nonce/IV/authentication rules; overview is not a production encryption tool." },
  "/algorithms/symmetric/des-key-schedule": { phase2Decision: "hybrid-exact-core", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "DEPRECATED", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "CUSTOM_EDUCATIONAL_LOGIC", requiredFix: "Keep DES schedule educational and deprecated; exact subkey vectors should be added before exact relabeling.", notes: "DES parity bits are dropped and DES remains deprecated." },
  "/algorithms/pki/x509-certificate-viewer": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Label as basic/conceptual viewer; do not claim trust, hostname, revocation, time, or chain validation.", notes: "Parsing fields is not certificate trust validation." },
  "/algorithms/pki/certificate-chain": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep conceptual trust-chain diagram; no real chain validation claim.", notes: "Trust requires anchors, policies, names, time, revocation, and signatures." },
  "/algorithms/pki/csr-viewer": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Label as basic CSR structure viewer unless formal parser and vectors are added.", notes: "A CSR is not a certificate and does not grant trust." },
  "/algorithms/tools/key-format-converter": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep as educational format structure converter with strong secret warning; do not silently transform real private keys.", notes: "Changing format does not change key security." },
  "/algorithms/tools/export-center": { phase2Decision: "conceptual-only", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "MANUAL_QA_REQUIRED", browserSupportStatus: "CONCEPTUAL_ONLY", requiredFix: "Keep export warnings and avoid exporting secrets without explicit user review/redaction.", notes: "Exports may contain plaintext or key material and must be reviewed before sharing." },
  "/algorithms/blockchain/ethereum-signature": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual; exact Ethereum signatures require secp256k1, Keccak, recovery id, message format, and address tests.", notes: "This page is not a wallet and must not request real private keys." },
  "/algorithms/blockchain/wallet-key-pair": { phase2Decision: "deferred-needs-library", implementationAccuracy: "CONCEPTUAL_PREVIEW", securityUseStatus: "SECRET_INPUT_RISK", verificationStatus: "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT", browserSupportStatus: "VETTED_LIBRARY_REQUIRED", requiredFix: "Keep conceptual; exact wallet derivation and address formats require vetted library and vectors.", notes: "Never paste real wallet private keys into educational tools." },
};

const demoRoutes = new Set(navigationItems.filter((item) => item.route.startsWith("/demos/")).map((item) => item.route));
const metadataByRoute = new Map(algorithmMetadata.map((item) => [item.route, item]));

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function pageType(route: string, category: string): CurrentPageType {
  if (demoRoutes.has(route)) return "demo";
  if (/tools|encoding|benchmark|export|saved/i.test(category)) return "tool";
  if (p0NeedExpert.has(route) || p2Routes.has(route)) return "generic-shell";
  return metadataByRoute.has(route) ? "custom" : "unknown";
}

function priorityFor(route: string): AuditPriority {
  if (p0NeedExpert.has(route)) return "P0";
  if (p1Routes.has(route)) return "P1";
  if (p2Routes.has(route)) return "P2";
  return "P3";
}

function securityFor(route: string, category: string, title: string): SecurityUseStatus {
  const text = `${route} ${category} ${title}`.toLowerCase();
  if (/attack|oracle|factorization|collision|known-plaintext|nonce-reuse|reverse-hash/.test(text)) return "ATTACK_CONCEPT_ONLY";
  if (/wallet|private|signature|certificate|csr|pem|der|key-format|export|random-bytes|rsa-key|hmac|password|pbkdf|bcrypt|scrypt|argon|hkdf/.test(text)) return "SECRET_INPUT_RISK";
  if (/md5|sha1|rc4|des|ecb|atbash|rot13|classical|zero-padding/.test(text)) return route.includes("md5") || route.includes("sha1") || route.includes("rc4") || route.includes("des") ? "DEPRECATED" : "UNSAFE";
  if (/legacy|cbc|cfb|ofb|ripemd|idea|rc5|rc6|blowfish|triple-des/.test(text)) return "LEGACY";
  if (/aes|gcm|ctr|sha2|sha3|hmac|pbkdf2|random/.test(text)) return "MODERN_SAFE_WHEN_USED_CORRECTLY";
  return "EDUCATIONAL_ONLY";
}

function accuracyFor(route: string, securityUseStatus: SecurityUseStatus): ImplementationAccuracy {
  if (p0NeedExpert.has(route)) return "NEEDS_EXPERT_REVIEW";
  if (securityUseStatus === "DEPRECATED" || securityUseStatus === "UNSAFE") return "DEPRECATED_OR_UNSAFE_DEMO";
  if (webCryptoRoutes.has(route) && officialVectorRoutes.has(route)) return "OFFICIAL_OR_WEBCRYPTO";
  if (officialVectorRoutes.has(route)) return "EXACT_EDUCATIONAL";
  if (p2Routes.has(route) || route.includes("/demos/")) return "CONCEPTUAL_PREVIEW";
  if (!metadataByRoute.has(route) && !demoRoutes.has(route)) return "PLACEHOLDER_OR_SUBSTITUTE";
  return "CONCEPTUAL_PREVIEW";
}

function browserSupportFor(route: string, accuracy: ImplementationAccuracy): BrowserSupportStatus {
  if (webCryptoRoutes.has(route)) return "WEB_CRYPTO";
  if (accuracy === "NEEDS_EXPERT_REVIEW") return "VETTED_LIBRARY_REQUIRED";
  if (accuracy === "PLACEHOLDER_OR_SUBSTITUTE") return "NOT_IMPLEMENTED_EXACTLY";
  if (accuracy === "CONCEPTUAL_PREVIEW") return "CONCEPTUAL_ONLY";
  return "CUSTOM_EDUCATIONAL_LOGIC";
}

function verificationFor(route: string, accuracy: ImplementationAccuracy): VerificationStatus {
  if (officialVectorRoutes.has(route)) return "HAS_OFFICIAL_TEST_VECTORS";
  if (accuracy === "EXACT_EDUCATIONAL") return "HAS_BASIC_UNIT_TESTS";
  if (accuracy === "NEEDS_EXPERT_REVIEW") return "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT";
  if (accuracy === "PLACEHOLDER_OR_SUBSTITUTE") return "NO_TEST_COVERAGE";
  return "MANUAL_QA_REQUIRED";
}

function requiredFixFor(priority: AuditPriority, accuracy: ImplementationAccuracy) {
  if (priority === "P0") return "Add explicit conceptual/needs-review boundary now; in Phase 2 replace substitute logic with vetted exact implementation or narrow the learning goal.";
  if (accuracy === "DEPRECATED_OR_UNSAFE_DEMO") return "Keep the educational demo, strengthen deprecation warnings, and add regression tests for the visible behavior.";
  if (accuracy === "OFFICIAL_OR_WEBCRYPTO" || accuracy === "EXACT_EDUCATIONAL") return "Preserve the implementation and add/expand official vectors plus accessibility QA.";
  return "Clarify the intended learning outcome, add vectors where possible, and avoid standards-compliant claims until verified.";
}

function riskFor(accuracy: ImplementationAccuracy, security: SecurityUseStatus) {
  if (security === "SECRET_INPUT_RISK") return "Users may paste real secrets or misunderstand exported/local material.";
  if (security === "ATTACK_CONCEPT_ONLY") return "Attack demo must remain bounded to authorized learning and avoid operational misuse.";
  if (accuracy === "NEEDS_EXPERT_REVIEW") return "Standards-heavy page can appear more exact than the current verification supports.";
  if (accuracy === "PLACEHOLDER_OR_SUBSTITUTE") return "Substitute output could be mistaken for a standards-compliant result.";
  if (security === "DEPRECATED" || security === "UNSAFE") return "Learners may miss that the primitive is unsafe for real protection.";
  return "Needs routine vector coverage, manual QA, and clearer learning checkpoints.";
}

function testsFor(route: string, verification: VerificationStatus) {
  const tests = ["Route smoke test", "Audit registry completeness check"];
  if (verification === "HAS_OFFICIAL_TEST_VECTORS") tests.push("Known-answer vector test");
  if (verification === "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT") tests.push("Official vector suite before exact relabeling");
  if (/secret|wallet|key|signature|pki|certificate|pem|der|export|random/.test(route)) tests.push("Secret-input warning visibility check");
  return tests;
}

function classify(item: typeof navigationItems[number]): ModuleAuditEntry {
  const priority = priorityFor(item.route);
  const securityUseStatus = securityFor(item.route, item.category, item.label);
  const implementationAccuracy = accuracyFor(item.route, securityUseStatus);
  const verificationStatus = verificationFor(item.route, implementationAccuracy);
  const base: ModuleAuditEntry = {
    id: slug(item.route),
    title: item.label,
    route: item.route,
    category: item.category,
    currentPageType: pageType(item.route, item.category),
    implementationAccuracy,
    securityUseStatus,
    verificationStatus,
    browserSupportStatus: browserSupportFor(item.route, implementationAccuracy),
    priority,
    phase2Decision: priority === "P0" ? "conceptual-only" : "not-p0",
    phaseTarget: priority === "P0" ? 2 : priority === "P1" ? 3 : priority === "P2" ? 4 : 5,
    mainRisk: riskFor(implementationAccuracy, securityUseStatus),
    requiredFix: requiredFixFor(priority, implementationAccuracy),
    requiredTests: testsFor(item.route, verificationStatus),
    notes: metadataByRoute.get(item.route)?.notes?.[0] ?? "Navigation-only demo route; keep status conservative until vectors and UI QA are complete.",
  };
  return { ...base, ...(phase2P0Overrides[item.route] ?? {}) };
}

export const moduleAuditRegistry = Object.fromEntries(navigationItems.map((item) => [item.route, classify(item)])) as Record<string, ModuleAuditEntry>;

export const moduleAuditEntries = Object.values(moduleAuditRegistry).sort((left, right) => left.route.localeCompare(right.route));

export function getModuleAuditEntry(route: string) {
  return moduleAuditRegistry[route];
}

export const moduleAuditSummary = moduleAuditEntries.reduce<Record<AuditPriority, number>>((summary, entry) => {
  summary[entry.priority] += 1;
  return summary;
}, { P0: 0, P1: 0, P2: 0, P3: 0 });
