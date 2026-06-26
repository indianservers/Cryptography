export type LearningPriority = "P0" | "P1" | "P3";

export interface FormulaVariable {
  symbol: string;
  meaning: string;
}

export interface Misconception {
  myth: string;
  correction: string;
}

export interface CheckpointQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleLearningContent {
  route: string;
  title: string;
  priority: LearningPriority;
  objective: string;
  beginnerTakeaway: string;
  formulaTitle: string;
  formula: string;
  variables: FormulaVariable[];
  constraints: string[];
  observationPrompts: string[];
  expectedPatterns: string[];
  misconceptions: Misconception[];
  realWorldUse: string;
  checkpointQuestions: CheckpointQuestion[];
  conceptualBoundary?: string;
  resultInterpretationTemplate?: string;
}

export const requiredP1LearningRoutes = [
  "/algorithms/attacks/ecb-pattern-leakage",
  "/algorithms/classical/atbash",
  "/algorithms/classical/rot13",
  "/algorithms/hash/md5",
  "/algorithms/hash/sha1",
  "/algorithms/symmetric/des",
  "/algorithms/symmetric/des-full-step",
  "/algorithms/attacks/caesar-brute-force",
] as const;

export const requiredP0LearningRoutes = [
  "/algorithms/classical/affine-cipher",
  "/algorithms/classical/columnar-transposition",
  "/algorithms/classical/rail-fence",
  "/algorithms/classical/substitution-cipher",
  "/algorithms/classical/playfair-cipher",
  "/algorithms/classical/hill-cipher",
  "/algorithms/symmetric/aes-mix-columns",
  "/algorithms/symmetric/aes-key-expansion",
  "/algorithms/kdf/hkdf",
  "/algorithms/blockchain/bitcoin-hashing",
  "/algorithms/encoding/pem-der",
  "/algorithms/asymmetric/rsa-padding",
  "/algorithms/padding/oaep",
  "/algorithms/padding/pss",
  "/algorithms/attacks/ecdsa-nonce-reuse",
  "/algorithms/attacks/padding-oracle-concept",
] as const;

export const requiredP3LearningRoutes = [
  "/algorithms/asymmetric/diffie-hellman",
  "/algorithms/asymmetric/rsa",
  "/algorithms/asymmetric/rsa-encryption",
  "/algorithms/asymmetric/rsa-decryption",
  "/algorithms/asymmetric/rsa-key-generation",
  "/algorithms/asymmetric/rsa-signature",
  "/algorithms/classical/vigenere-cipher",
  "/algorithms/encoding/base64",
  "/algorithms/encoding/binary",
  "/algorithms/encoding/hex",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/hash/sha2",
  "/algorithms/hash/sha3",
  "/algorithms/math/modular-arithmetic",
  "/algorithms/math/euclidean-algorithm",
  "/algorithms/math/finite-fields",
  "/algorithms/math/gf256",
  "/algorithms/math/chinese-remainder",
  "/algorithms/math/discrete-logarithm",
  "/algorithms/math/elliptic-curve-points",
] as const;

const p1Titles: Record<(typeof requiredP1LearningRoutes)[number], string> = {
  "/algorithms/attacks/ecb-pattern-leakage": "ECB Pattern Leakage",
  "/algorithms/classical/atbash": "Atbash Cipher",
  "/algorithms/classical/rot13": "ROT13",
  "/algorithms/hash/md5": "MD5",
  "/algorithms/hash/sha1": "SHA-1",
  "/algorithms/symmetric/des": "DES Workbench",
  "/algorithms/symmetric/des-full-step": "DES Full Step",
  "/algorithms/attacks/caesar-brute-force": "Caesar Brute Force",
};

const p0Titles: Record<(typeof requiredP0LearningRoutes)[number], string> = {
  "/algorithms/classical/affine-cipher": "Affine Cipher",
  "/algorithms/classical/columnar-transposition": "Columnar Transposition",
  "/algorithms/classical/rail-fence": "Rail Fence Cipher",
  "/algorithms/classical/substitution-cipher": "Monoalphabetic Substitution",
  "/algorithms/classical/playfair-cipher": "Playfair Cipher",
  "/algorithms/classical/hill-cipher": "Hill Cipher",
  "/algorithms/symmetric/aes-mix-columns": "AES MixColumns",
  "/algorithms/symmetric/aes-key-expansion": "AES Key Expansion",
  "/algorithms/kdf/hkdf": "HKDF",
  "/algorithms/blockchain/bitcoin-hashing": "Bitcoin Hashing",
  "/algorithms/encoding/pem-der": "PEM and DER",
  "/algorithms/asymmetric/rsa-padding": "RSA Padding",
  "/algorithms/padding/oaep": "OAEP",
  "/algorithms/padding/pss": "PSS",
  "/algorithms/attacks/ecdsa-nonce-reuse": "ECDSA Nonce Reuse",
  "/algorithms/attacks/padding-oracle-concept": "Padding Oracle Concept",
};

const p3Titles: Record<(typeof requiredP3LearningRoutes)[number], string> = {
  "/algorithms/asymmetric/diffie-hellman": "Diffie-Hellman",
  "/algorithms/asymmetric/rsa": "RSA Overview",
  "/algorithms/asymmetric/rsa-encryption": "RSA Encryption",
  "/algorithms/asymmetric/rsa-decryption": "RSA Decryption",
  "/algorithms/asymmetric/rsa-key-generation": "RSA Key Generation",
  "/algorithms/asymmetric/rsa-signature": "RSA Signature",
  "/algorithms/classical/vigenere-cipher": "Vigenere Cipher",
  "/algorithms/encoding/base64": "Base64",
  "/algorithms/encoding/binary": "Binary Encoding",
  "/algorithms/encoding/hex": "Hex Encoding",
  "/algorithms/mac/hmac": "HMAC",
  "/algorithms/kdf/pbkdf2": "PBKDF2",
  "/algorithms/hash/sha2": "SHA-2",
  "/algorithms/hash/sha3": "SHA-3",
  "/algorithms/math/modular-arithmetic": "Modular Arithmetic",
  "/algorithms/math/euclidean-algorithm": "Euclidean Algorithm",
  "/algorithms/math/finite-fields": "Finite Fields",
  "/algorithms/math/gf256": "GF(2^8)",
  "/algorithms/math/chinese-remainder": "Chinese Remainder Theorem",
  "/algorithms/math/discrete-logarithm": "Discrete Logarithm",
  "/algorithms/math/elliptic-curve-points": "Elliptic Curve Points",
};

const exactClassicalFormula: Record<string, string> = {
  "/algorithms/classical/affine-cipher": "E(x) = (a*x + b) mod 26, where a must have an inverse modulo 26.",
  "/algorithms/classical/columnar-transposition": "Write text in rows under the keyword, then read columns in sorted keyword order.",
  "/algorithms/classical/rail-fence": "Place letters on a zig-zag rail path, then read each rail from left to right.",
  "/algorithms/classical/substitution-cipher": "Each plaintext letter maps to exactly one ciphertext letter from the replacement alphabet.",
  "/algorithms/classical/playfair-cipher": "Split text into digraphs, then use row, column, or rectangle rules in a 5x5 square.",
  "/algorithms/classical/hill-cipher": "Treat each letter block as a vector and multiply it by the key matrix modulo 26.",
};

const specificFormula: Record<string, string> = {
  ...exactClassicalFormula,
  "/algorithms/attacks/ecb-pattern-leakage": "Identical plaintext blocks encrypted with the same key become identical ciphertext blocks in ECB.",
  "/algorithms/classical/atbash": "E(x) = 25 - x, so A maps to Z, B maps to Y, and the same rule decrypts.",
  "/algorithms/classical/rot13": "E(x) = (x + 13) mod 26, and applying ROT13 twice returns the original letter.",
  "/algorithms/hash/md5": "MD5 compresses message blocks into a 128-bit digest, but collision resistance is broken.",
  "/algorithms/hash/sha1": "SHA-1 compresses blocks into a 160-bit digest, but practical collision attacks exist.",
  "/algorithms/symmetric/des": "Each DES round uses newR = L xor F(R, roundKey), then swaps the halves.",
  "/algorithms/symmetric/des-full-step": "DES applies initial permutation, 16 Feistel rounds, and final permutation over a 64-bit block.",
  "/algorithms/attacks/caesar-brute-force": "Try every shift k from 0 to 25 and score which plaintext looks most readable.",
  "/algorithms/symmetric/aes-mix-columns": "Each column is multiplied by a fixed matrix over GF(2^8).",
  "/algorithms/symmetric/aes-key-expansion": "Each new AES word comes from a previous word xor a transformed earlier word.",
  "/algorithms/kdf/hkdf": "HKDF runs Extract to make a pseudorandom key, then Expand to make output key material.",
  "/algorithms/blockchain/bitcoin-hashing": "Bitcoin block and transaction identifiers commonly use SHA256(SHA256(bytes)).",
  "/algorithms/encoding/pem-der": "DER is binary ASN.1 data; PEM is Base64-wrapped DER with header and footer lines.",
  "/algorithms/asymmetric/rsa-padding": "Padding adds structured randomized data before the RSA exponent operation.",
  "/algorithms/padding/oaep": "OAEP masks a data block and seed with hash-based masks before RSA encryption.",
  "/algorithms/padding/pss": "PSS combines a message hash, random salt, mask, and trailer byte for signatures.",
  "/algorithms/attacks/ecdsa-nonce-reuse": "If the same ECDSA nonce k signs two messages, equations can expose the private key.",
  "/algorithms/attacks/padding-oracle-concept": "A padding oracle leaks whether padding was valid, so attackers can learn information from errors.",
  "/algorithms/asymmetric/diffie-hellman": "Alice computes B^a mod p and Bob computes A^b mod p; both equal g^(ab) mod p.",
  "/algorithms/asymmetric/rsa": "RSA uses c = m^e mod n and m = c^d mod n with matched public and private exponents.",
  "/algorithms/asymmetric/rsa-encryption": "RSA encryption computes ciphertext c = paddedMessage^e mod n.",
  "/algorithms/asymmetric/rsa-decryption": "RSA decryption computes paddedMessage = c^d mod n, then removes valid padding.",
  "/algorithms/asymmetric/rsa-key-generation": "Choose primes p and q, set n = p*q, then choose e and d so e*d = 1 mod phi(n).",
  "/algorithms/asymmetric/rsa-signature": "RSA signatures sign an encoded message representative with s = encodedHash^d mod n.",
  "/algorithms/classical/vigenere-cipher": "E_i = (P_i + K_i) mod 26, where the key letter repeats across the message.",
  "/algorithms/encoding/base64": "Base64 regroups every 3 bytes into 4 printable 6-bit symbols.",
  "/algorithms/encoding/binary": "Binary writes each byte as eight 0 or 1 bits.",
  "/algorithms/encoding/hex": "Hex writes each byte as two base-16 symbols.",
  "/algorithms/mac/hmac": "HMAC = H((K xor opad) || H((K xor ipad) || message)).",
  "/algorithms/kdf/pbkdf2": "PBKDF2 repeats a pseudorandom function many times to slow password guessing.",
  "/algorithms/hash/sha2": "SHA-2 updates a chaining state with compression rounds for each message block.",
  "/algorithms/hash/sha3": "SHA-3 absorbs input into a sponge state and squeezes the digest out.",
  "/algorithms/math/modular-arithmetic": "a mod n is the remainder after wrapping around n.",
  "/algorithms/math/euclidean-algorithm": "Repeatedly replace (a, b) with (b, a mod b) until b is zero.",
  "/algorithms/math/finite-fields": "A finite field lets addition, multiplication, and division stay inside a fixed set.",
  "/algorithms/math/gf256": "GF(2^8) multiplies bytes as polynomials and reduces them by the AES polynomial.",
  "/algorithms/math/chinese-remainder": "Separate congruences can combine into one unique answer modulo the product of coprime moduli.",
  "/algorithms/math/discrete-logarithm": "Given y = g^x mod p, the hard problem is finding x.",
  "/algorithms/math/elliptic-curve-points": "Point addition and doubling create Q = dG after repeated group operations.",
};

const conceptualBoundaries: Record<string, string> = {
  "/algorithms/blockchain/bitcoin-hashing": "This page can show double SHA-256 and byte-order ideas, but it is not a miner, wallet, or full consensus validator.",
  "/algorithms/encoding/pem-der": "This page explains structure only; it does not validate certificate trust, hostnames, revocation, or ASN.1 edge cases.",
  "/algorithms/asymmetric/rsa-padding": "This is a padding structure walkthrough. Exact OAEP or PSS conformance requires scheme-specific vectors and strict length checks.",
  "/algorithms/padding/oaep": "This is an OAEP learning model. Do not treat the displayed structure as standards-compliant encryption output.",
  "/algorithms/padding/pss": "This is a PSS learning model. Do not treat the displayed structure as a standards-compliant signature encoding.",
  "/algorithms/attacks/ecdsa-nonce-reuse": "This page uses toy arithmetic to explain a defensive lesson. It must not be used against real signatures or keys.",
  "/algorithms/attacks/padding-oracle-concept": "This page explains the defensive concept only: uniform errors and authenticated encryption stop this class of leak.",
};

function inferFamily(route: string) {
  if (route.includes("/classical/")) return "classical";
  if (route.includes("/encoding/")) return "encoding";
  if (route.includes("/hash/")) return "hash";
  if (route.includes("/mac/")) return "mac";
  if (route.includes("/kdf/")) return "kdf";
  if (route.includes("/math/")) return "math";
  if (route.includes("/attacks/")) return "attack";
  if (route.includes("/padding/") || route.includes("rsa-padding")) return "padding";
  if (route.includes("/asymmetric/")) return "asymmetric";
  if (route.includes("/symmetric/")) return "symmetric";
  if (route.includes("/blockchain/")) return "hash";
  return "algorithm";
}

function variablesFor(family: string): FormulaVariable[] {
  if (family === "classical") return [{ symbol: "x", meaning: "the current letter number, A = 0 through Z = 25" }, { symbol: "mod 26", meaning: "wrap around the alphabet" }];
  if (family === "encoding") return [{ symbol: "byte", meaning: "8 bits of input data" }, { symbol: "symbol", meaning: "printable text representation of grouped bits" }];
  if (family === "hash") return [{ symbol: "block", meaning: "fixed-size piece of the message" }, { symbol: "state", meaning: "internal chaining value updated by each block" }];
  if (family === "mac") return [{ symbol: "K", meaning: "shared secret key" }, { symbol: "tag", meaning: "verification value recomputed by the receiver" }];
  if (family === "kdf") return [{ symbol: "salt", meaning: "public value that separates equal passwords" }, { symbol: "cost", meaning: "work factor that slows guessing" }];
  if (family === "math") return [{ symbol: "mod n", meaning: "wrap every result into the range 0 to n - 1" }, { symbol: "inverse", meaning: "a value that multiplies back to 1 modulo n" }];
  if (family === "attack") return [{ symbol: "leak", meaning: "observable clue the design should have hidden" }, { symbol: "defense", meaning: "the design rule that removes the clue" }];
  if (family === "padding") return [{ symbol: "message", meaning: "data being encoded before the private or public operation" }, { symbol: "mask", meaning: "structured randomized transformation used by modern padding" }];
  if (family === "asymmetric") return [{ symbol: "n", meaning: "public modulus or group parameter" }, { symbol: "secret", meaning: "private exponent or private scalar" }];
  return [{ symbol: "state", meaning: "current internal value" }, { symbol: "round", meaning: "one repeated transformation step" }];
}

function constraintsFor(family: string, route: string): string[] {
  if (route.includes("md5") || route.includes("sha1") || route.includes("des")) return ["Deprecated for new security designs.", "Use this page for recognition, migration, and exam understanding."];
  if (family === "classical") return ["Educational A-Z rules only.", "Good for learning patterns, not for real confidentiality."];
  if (family === "encoding") return ["Encoding is reversible without a key.", "Do not present encoded text as encrypted text."];
  if (family === "attack") return ["Use only local toy examples.", "Focus on the defense the page is teaching."];
  if (family === "padding") return ["Exact standards require vectors and strict length rules.", "Randomness and validation rules matter."];
  if (family === "asymmetric") return ["Tiny numbers are for learning only.", "Real systems require vetted libraries and safe padding or protocols."];
  if (family === "kdf") return ["Never paste production passwords or keys.", "Parameters must be chosen for the deployment context."];
  return ["Track the current step before reading the final output.", "Use the security badge to separate classroom use from real use."];
}

function promptsFor(title: string, family: string): string[] {
  if (family === "classical") return [`Watch which letter or position changes in ${title}.`, "Compare the intermediate mapping with the final text."];
  if (family === "encoding") return [`Notice that ${title} changes representation, not secrecy.`, "Check where padding, grouping, or byte boundaries appear."];
  if (family === "hash") return [`Change one character and compare the ${title} digest.`, "Watch how fixed-size output hides the original length details."];
  if (family === "kdf") return ["Increase the cost or iteration setting and observe which value changes.", "Change only the salt and notice that the derived value changes too."];
  if (family === "attack") return ["Find the clue the insecure design accidentally reveals.", "Identify the defense that removes that clue."];
  if (family === "math") return ["Follow the small-number example before trying larger parameters.", "Check when values wrap back around the modulus."];
  return [`Track the current ${title} stage before reading the final result.`, "Separate intermediate values from the final output."];
}

function patternsFor(title: string, family: string): string[] {
  if (family === "classical") return ["Letters change predictably, which makes the rule easy to reverse.", "Repeated patterns often remain visible to an attacker."];
  if (family === "encoding") return ["Output grows or shrinks in predictable groups.", "Anyone who knows the format can decode it."];
  if (family === "hash") return ["The digest length stays fixed.", "A small input change should produce a very different digest."];
  if (family === "attack") return ["A visible pattern or error gives away information.", "The secure design removes the visible clue."];
  if (family === "math") return ["Small inputs make the rule visible.", "The same rule scales to much larger values in real systems."];
  return [`${title} should show one current stage at a time.`, "The final value should be visually separated from working values."];
}

function misconceptionsFor(family: string): Misconception[] {
  if (family === "encoding") return [{ myth: "If it looks unreadable, it must be encrypted.", correction: "Encoding only changes representation; it has no secret key." }];
  if (family === "hash") return [{ myth: "A hash can be decrypted.", correction: "A hash is a one-way fingerprint, not ciphertext." }];
  if (family === "classical") return [{ myth: "Classical ciphers are safe if the key is hidden.", correction: "Their patterns are too small and regular for real confidentiality." }];
  if (family === "attack") return [{ myth: "Attack pages are recipes to use on real systems.", correction: "These pages are bounded defensive lessons using toy data." }];
  if (family === "padding") return [{ myth: "Padding is just filler bytes.", correction: "Modern padding encodes security checks and must be validated carefully." }];
  if (family === "kdf") return [{ myth: "Hashing a password once is enough.", correction: "Password KDFs add salt and cost to slow large-scale guessing." }];
  if (family === "math") return [{ myth: "The small numbers are the security.", correction: "Small numbers reveal the rule; real security needs huge validated parameters." }];
  return [{ myth: "The final output tells the whole story.", correction: "The intermediate state explains why the algorithm produced that output." }];
}

function realUseFor(family: string, title: string) {
  if (family === "classical") return `${title} appears in exams and cryptanalysis history because it makes substitution and transposition visible.`;
  if (family === "encoding") return `${title} is used when binary data must travel through text-only systems.`;
  if (family === "hash") return `${title} style hashing is used for fingerprints, integrity checks, and signed data workflows.`;
  if (family === "kdf") return `${title} is used to derive keys or slow password guessing before storage or encryption.`;
  if (family === "math") return `${title} is a building block behind public-key cryptography and finite-field algorithms.`;
  if (family === "attack") return `${title} helps students recognize a failure mode so they can choose safer designs.`;
  if (family === "padding") return `${title} is part of making public-key operations safe and unambiguous.`;
  return `${title} is useful for connecting classroom steps to real protocol design decisions.`;
}

function checkpointFor(title: string, family: string): CheckpointQuestion[] {
  const question = family === "encoding"
    ? `What is the safest statement about ${title}?`
    : family === "attack"
      ? `What should you remember after studying ${title}?`
      : `What should you check first while using ${title}?`;
  const options = family === "encoding"
    ? ["It changes representation without secrecy.", "It encrypts data with a hidden key.", "It proves who sent the message."]
    : family === "attack"
      ? ["The leaked clue and the defense.", "The largest possible input only.", "How to reuse the weakness."]
      : ["The current step and its rule.", "Only the final text.", "Only whether the output is long."];
  return [{
    question,
    options,
    correctIndex: 0,
    explanation: family === "encoding"
      ? "Encoding is reversible by format rules, not protected by a secret."
      : "The learning value is in connecting the step rule to the final value.",
  }];
}

function makeEntry(route: string, title: string, priority: LearningPriority): ModuleLearningContent {
  const family = inferFamily(route);
  return {
    route,
    title,
    priority,
    objective: `Understand what ${title} changes, what stays visible, and what the final value means.`,
    beginnerTakeaway: `Read ${title} as a sequence of small transformations before trusting the final output.`,
    formulaTitle: `${title} rule`,
    formula: specificFormula[route] ?? `${title} maps inputs through a documented rule to produce intermediate values and a final result.`,
    variables: variablesFor(family),
    constraints: constraintsFor(family, route),
    observationPrompts: promptsFor(title, family),
    expectedPatterns: patternsFor(title, family),
    misconceptions: misconceptionsFor(family),
    realWorldUse: realUseFor(family, title),
    checkpointQuestions: checkpointFor(title, family),
    conceptualBoundary: conceptualBoundaries[route],
    resultInterpretationTemplate: `The final ${title} output should be read after checking the highlighted step, the formula rule, and any safety boundary.`,
  };
}

const p1Entries = requiredP1LearningRoutes.map((route) => makeEntry(route, p1Titles[route], "P1"));
const p0Entries = requiredP0LearningRoutes.map((route) => makeEntry(route, p0Titles[route], "P0"));
const p3Entries = requiredP3LearningRoutes.map((route) => makeEntry(route, p3Titles[route], "P3"));

export const moduleLearningContent = Object.fromEntries(
  [...p1Entries, ...p0Entries, ...p3Entries].map((entry) => [entry.route, entry]),
) as Record<string, ModuleLearningContent>;

export const moduleLearningEntries = Object.values(moduleLearningContent).sort((left, right) => left.route.localeCompare(right.route));

export function getLearningContent(route: string) {
  return moduleLearningContent[route];
}
