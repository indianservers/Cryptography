import type { ModuleAuditEntry } from "./moduleAuditRegistry";

export type ModuleArchetypeType =
  | "classical-cipher"
  | "hash-function"
  | "block-cipher"
  | "mode-of-operation"
  | "kdf-password"
  | "mac-authentication"
  | "pki-certificate"
  | "attack-concept"
  | "encoding-bytes"
  | "math-foundation"
  | "blockchain-wallet"
  | "tool-utility"
  | "demo-simple"
  | "generic-concept";

export type PreferredInputLayout = "single-column" | "two-column" | "wide-text-first" | "matrix-first";
export type OutputStyle = "final-first" | "intermediate-first" | "table-heavy" | "diagram-heavy";

export interface ModuleArchetype {
  type: ModuleArchetypeType;
  preferredInputLayout: PreferredInputLayout;
  outputStyle: OutputStyle;
  needsSecretWarningZone: boolean;
  needsConceptualBoundaryZone: boolean;
  needsStepControls: boolean;
  needsPresetBar: boolean;
  needsMobileActionBar: boolean;
  needsScrollableOutput: boolean;
  commonSections: string[];
  mobileNotes: string[];
  accessibilityNotes: string[];
}

const baseArchetypes: Record<ModuleArchetypeType, ModuleArchetype> = {
  "classical-cipher": {
    type: "classical-cipher",
    preferredInputLayout: "two-column",
    outputStyle: "final-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: false,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Plaintext or ciphertext", "Key settings", "Final text", "Transformation steps", "Unsafe historical note"],
    mobileNotes: ["Stack input above output.", "Scroll mapping tables inside the panel."],
    accessibilityNotes: ["Label key controls.", "Do not rely only on colored mapping cells."],
  },
  "hash-function": {
    type: "hash-function",
    preferredInputLayout: "wide-text-first",
    outputStyle: "final-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Message input", "Digest output", "Compression or sponge trace", "Exactness note"],
    mobileNotes: ["Wrap long digest strings.", "Keep parameter controls above digest output."],
    accessibilityNotes: ["Name digest variants in text.", "Expose deprecation warnings for legacy hashes."],
  },
  "block-cipher": {
    type: "block-cipher",
    preferredInputLayout: "two-column",
    outputStyle: "intermediate-first",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Block input", "Key or round settings", "Operation summary", "Round trace", "Final block"],
    mobileNotes: ["Keep matrices inside scrollable panels.", "Avoid wide round tables at page level."],
    accessibilityNotes: ["Label rounds and current stage.", "Pair color highlights with text labels."],
  },
  "mode-of-operation": {
    type: "mode-of-operation",
    preferredInputLayout: "two-column",
    outputStyle: "diagram-heavy",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Plaintext blocks", "Key and IV or nonce", "Block flow", "Final ciphertext", "Nonce or IV warning"],
    mobileNotes: ["Scroll block diagrams inside their panels.", "Keep nonce warnings before inputs."],
    accessibilityNotes: ["Describe arrows in text.", "Do not use color alone for chained blocks."],
  },
  "kdf-password": {
    type: "kdf-password",
    preferredInputLayout: "two-column",
    outputStyle: "final-first",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Password or input key material", "Salt", "Cost settings", "Derived output", "Secret warning"],
    mobileNotes: ["Keep numeric controls large enough to tap.", "Show warnings before password fields."],
    accessibilityNotes: ["Associate validation with each cost field.", "Do not encourage copying production secrets."],
  },
  "mac-authentication": {
    type: "mac-authentication",
    preferredInputLayout: "two-column",
    outputStyle: "final-first",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Message", "Secret key", "AAD if present", "Tag output", "Authentication flow"],
    mobileNotes: ["Keep key warning visible.", "Wrap tag output cleanly."],
    accessibilityNotes: ["State that MAC authenticates, not encrypts.", "Use labels for inner and outer steps."],
  },
  "pki-certificate": {
    type: "pki-certificate",
    preferredInputLayout: "wide-text-first",
    outputStyle: "table-heavy",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: false,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["PEM or DER input", "Parse or inspect", "Validation boundaries", "Export review"],
    mobileNotes: ["PEM blocks must scroll inside the panel.", "Validation status should remain near parsed fields."],
    accessibilityNotes: ["Distinguish inspection from trust validation in text.", "Label each parsed field table."],
  },
  "attack-concept": {
    type: "attack-concept",
    preferredInputLayout: "wide-text-first",
    outputStyle: "intermediate-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Authorized learning warning", "Preconditions", "Leakage", "Mitigation", "Toy result"],
    mobileNotes: ["Keep caps and toy scope visible.", "Avoid page-level overflow in traces."],
    accessibilityNotes: ["Use defensive wording.", "Explain leaked information in text."],
  },
  "encoding-bytes": {
    type: "encoding-bytes",
    preferredInputLayout: "wide-text-first",
    outputStyle: "final-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: false,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Input bytes or text", "Output representation", "Chunk view", "Encoding is not encryption note"],
    mobileNotes: ["Chunk long values.", "Keep copy buttons close to outputs."],
    accessibilityNotes: ["Label byte groups.", "Do not imply secrecy."],
  },
  "math-foundation": {
    type: "math-foundation",
    preferredInputLayout: "two-column",
    outputStyle: "table-heavy",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: false,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: false,
    needsScrollableOutput: true,
    commonSections: ["Inputs", "Formula rule", "Final value", "Step trace", "Cryptography connection"],
    mobileNotes: ["Step tables scroll inside panels.", "Keep invalid modulus messages near inputs."],
    accessibilityNotes: ["Use captions for tables.", "Name non-invertible or off-curve states in text."],
  },
  "blockchain-wallet": {
    type: "blockchain-wallet",
    preferredInputLayout: "wide-text-first",
    outputStyle: "intermediate-first",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Toy input", "Hash or signature path", "Conceptual output", "Wallet/key warning"],
    mobileNotes: ["Do not hide secret warnings below long outputs.", "Chunk hashes and addresses."],
    accessibilityNotes: ["Avoid wallet-production claims.", "Label endianness and hash stages."],
  },
  "tool-utility": {
    type: "tool-utility",
    preferredInputLayout: "two-column",
    outputStyle: "final-first",
    needsSecretWarningZone: true,
    needsConceptualBoundaryZone: true,
    needsStepControls: false,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Controls", "Result", "Warnings", "Export or copy review"],
    mobileNotes: ["Keep core actions reachable.", "Avoid wide tables without wrappers."],
    accessibilityNotes: ["Give buttons explicit names.", "Announce copy or export completion."],
  },
  "demo-simple": {
    type: "demo-simple",
    preferredInputLayout: "single-column",
    outputStyle: "final-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: false,
    needsStepControls: false,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Input", "Output", "Short explanation"],
    mobileNotes: ["Stack everything.", "Keep buttons large."],
    accessibilityNotes: ["Use simple labels.", "Keep copy feedback announced."],
  },
  "generic-concept": {
    type: "generic-concept",
    preferredInputLayout: "two-column",
    outputStyle: "intermediate-first",
    needsSecretWarningZone: false,
    needsConceptualBoundaryZone: true,
    needsStepControls: true,
    needsPresetBar: true,
    needsMobileActionBar: true,
    needsScrollableOutput: true,
    commonSections: ["Inputs", "Conceptual transform", "Output", "Boundary note"],
    mobileNotes: ["Prefer stacked panels on narrow screens.", "Wrap long output values."],
    accessibilityNotes: ["State limitations in text.", "Keep current step labels visible."],
  },
};

export const p2ArchetypeRoutes = {
  "/algorithms/hash/blake2": "hash-function",
  "/algorithms/hash/blake3": "hash-function",
  "/algorithms/hash/keccak-sponge": "hash-function",
  "/algorithms/hash/ripemd160": "hash-function",
  "/algorithms/mac/cmac": "mac-authentication",
  "/algorithms/mac/gmac": "mac-authentication",
  "/algorithms/mac/poly1305": "mac-authentication",
  "/algorithms/blockchain/merkle-tree": "blockchain-wallet",
  "/algorithms/symmetric/camellia": "block-cipher",
  "/algorithms/symmetric/idea": "block-cipher",
  "/algorithms/symmetric/rc6": "block-cipher",
  "/algorithms/symmetric/serpent": "block-cipher",
  "/algorithms/symmetric/twofish": "block-cipher",
  "/algorithms/stream/salsa20": "block-cipher",
} as const satisfies Record<string, ModuleArchetypeType>;

const explicitArchetypeRoutes: Record<string, ModuleArchetypeType> = {
  ...p2ArchetypeRoutes,
  "/algorithms/classical/affine-cipher": "classical-cipher",
  "/algorithms/classical/columnar-transposition": "classical-cipher",
  "/algorithms/classical/rail-fence": "classical-cipher",
  "/algorithms/classical/substitution-cipher": "classical-cipher",
  "/algorithms/classical/playfair-cipher": "classical-cipher",
  "/algorithms/classical/hill-cipher": "classical-cipher",
  "/algorithms/classical/caesar-cipher": "classical-cipher",
  "/algorithms/classical/vigenere-cipher": "classical-cipher",
  "/algorithms/classical/atbash": "classical-cipher",
  "/algorithms/classical/rot13": "classical-cipher",
  "/algorithms/encoding/base64": "encoding-bytes",
  "/algorithms/encoding/binary": "encoding-bytes",
  "/algorithms/encoding/hex": "encoding-bytes",
  "/algorithms/encoding/ascii-unicode": "encoding-bytes",
  "/algorithms/encoding/big-integer": "encoding-bytes",
  "/algorithms/encoding/pem-der": "pki-certificate",
  "/algorithms/kdf/pbkdf2": "kdf-password",
  "/algorithms/kdf/hkdf": "kdf-password",
  "/algorithms/kdf/argon2": "kdf-password",
  "/algorithms/kdf/bcrypt": "kdf-password",
  "/algorithms/kdf/scrypt": "kdf-password",
  "/algorithms/mac/hmac": "mac-authentication",
  "/algorithms/pki/x509-certificate-viewer": "pki-certificate",
  "/algorithms/pki/csr-viewer": "pki-certificate",
  "/algorithms/pki/certificate-chain": "pki-certificate",
  "/algorithms/pki/self-signed-demo": "pki-certificate",
  "/algorithms/tools/key-format-converter": "pki-certificate",
  "/algorithms/tools/export-center": "tool-utility",
  "/algorithms/attacks/ecb-pattern-leakage": "attack-concept",
  "/algorithms/attacks/ecdsa-nonce-reuse": "attack-concept",
  "/algorithms/attacks/padding-oracle-concept": "attack-concept",
  "/algorithms/attacks/caesar-brute-force": "attack-concept",
  "/algorithms/attacks/frequency-analysis": "attack-concept",
  "/algorithms/attacks/hash-collision": "attack-concept",
  "/algorithms/attacks/nonce-reuse": "attack-concept",
  "/algorithms/attacks/xor-known-plaintext": "attack-concept",
  "/algorithms/attacks/rsa-factorization": "attack-concept",
  "/algorithms/attacks/rsa-small-exponent": "attack-concept",
  "/algorithms/attacks/vigenere-attack": "attack-concept",
  "/algorithms/attacks/reverse-hash": "attack-concept",
  "/algorithms/math/modular-arithmetic": "math-foundation",
  "/algorithms/math/euclidean-algorithm": "math-foundation",
  "/algorithms/math/finite-fields": "math-foundation",
  "/algorithms/math/gf256": "math-foundation",
  "/algorithms/math/chinese-remainder": "math-foundation",
  "/algorithms/math/discrete-logarithm": "math-foundation",
  "/algorithms/math/elliptic-curve-points": "math-foundation",
  "/algorithms/math/primes": "math-foundation",
  "/algorithms/math/primitive-roots": "math-foundation",
  "/algorithms/tools/benchmark": "tool-utility",
  "/algorithms/tools/audit": "tool-utility",
  "/algorithms/tools/test-vectors": "tool-utility",
  "/algorithms/tools/entropy-analyzer": "tool-utility",
  "/algorithms/tools/saved-experiments": "tool-utility",
};

function inferType(route: string, category: string): ModuleArchetypeType {
  const text = `${route} ${category}`.toLowerCase();
  if (route.startsWith("/demos/")) return "demo-simple";
  if (text.includes("classical")) return "classical-cipher";
  if (text.includes("hash") || text.includes("sha") || text.includes("md5") || text.includes("keccak") || text.includes("blake")) return "hash-function";
  if (text.includes("mac") || text.includes("poly1305") || text.includes("gmac") || text.includes("cmac")) return "mac-authentication";
  if (text.includes("kdf") || text.includes("password") || text.includes("bcrypt") || text.includes("scrypt") || text.includes("argon")) return "kdf-password";
  if (text.includes("certificate") || text.includes("pki") || text.includes("pem") || text.includes("der") || text.includes("csr") || text.includes("key-format")) return "pki-certificate";
  if (text.includes("attack") || text.includes("oracle") || text.includes("collision") || text.includes("factorization")) return "attack-concept";
  if (text.includes("encoding") || text.includes("base64") || text.includes("binary") || text.includes("hex")) return "encoding-bytes";
  if (text.includes("math") || text.includes("field") || text.includes("modular") || text.includes("discrete")) return "math-foundation";
  if (text.includes("mode") || text.includes("ecb") || text.includes("cbc") || text.includes("gcm") || text.includes("ctr")) return "mode-of-operation";
  if (text.includes("wallet") || text.includes("blockchain") || text.includes("merkle")) return "blockchain-wallet";
  if (text.includes("tool") || text.includes("benchmark") || text.includes("export")) return "tool-utility";
  if (text.includes("aes") || text.includes("des") || text.includes("cipher") || text.includes("stream")) return "block-cipher";
  return "generic-concept";
}

function withRegistryBoundaries(archetype: ModuleArchetype, registryEntry?: ModuleAuditEntry): ModuleArchetype {
  if (!registryEntry) return archetype;
  const needsConceptualBoundaryZone =
    archetype.needsConceptualBoundaryZone ||
    registryEntry.implementationAccuracy === "CONCEPTUAL_PREVIEW" ||
    registryEntry.implementationAccuracy === "NEEDS_EXPERT_REVIEW" ||
    registryEntry.implementationAccuracy === "PLACEHOLDER_OR_SUBSTITUTE" ||
    registryEntry.phase2Decision === "conceptual-only" ||
    registryEntry.phase2Decision === "hybrid-exact-core" ||
    registryEntry.phase2Decision === "deferred-needs-library";
  const needsSecretWarningZone =
    archetype.needsSecretWarningZone ||
    registryEntry.securityUseStatus === "SECRET_INPUT_RISK";
  return { ...archetype, needsConceptualBoundaryZone, needsSecretWarningZone };
}

export function getModuleArchetype(route: string, category: string, registryEntry?: ModuleAuditEntry): ModuleArchetype {
  const type = explicitArchetypeRoutes[route] ?? inferType(route, category);
  return withRegistryBoundaries(baseArchetypes[type] ?? baseArchetypes["generic-concept"], registryEntry);
}

export const moduleArchetypeRegistry = explicitArchetypeRoutes;
export const moduleArchetypes = baseArchetypes;
