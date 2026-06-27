import { ArrowRight, BookOpen, Lightbulb, Map, RotateCcw, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import type { AlgorithmMetadata, SecurityStatus } from "../../types";
import { algorithmMetadata, findAlgorithm } from "../../data/algorithmMetadata";

function familyFor(title: string, category: string) {
  const text = `${title} ${category}`;
  if (/rsa/i.test(text)) return "rsa";
  if (/\baes\b/i.test(text)) return "aes";
  if (/\bdes\b|3des|triple des/i.test(text)) return "des";
  if (/diffie|elgamal/i.test(text)) return "dh";
  if (/ecc|ecdh|ecdsa|ed25519|x25519|curve/i.test(text)) return "ecc";
  if (/md5|sha|keccak|blake|ripemd|hash/i.test(text)) return "hash";
  if (/hmac|cmac|gmac|poly1305|mac/i.test(text)) return "mac";
  if (/pbkdf2|bcrypt|scrypt|argon2|hkdf|derivation|kdf/i.test(text)) return "kdf";
  if (/base64|hex|binary|encoding|ascii|unicode|pem|der/i.test(text)) return "encoding";
  if (/attack|cryptanalysis|frequency|oracle|collision|nonce|factorization/i.test(text)) return "attack";
  if (/padding|oaep|pss|pkcs|ansi|zero/i.test(text)) return "padding";
  if (/stream|rc4|chacha|salsa|lfsr|one-time/i.test(text)) return "stream";
  if (/mode|cbc|ecb|gcm|ctr|cfb|ofb|xts/i.test(text)) return "mode";
  if (/math|prime|modular|field|root|logarithm|remainder/i.test(text)) return "math";
  return "generic";
}

function factFor(family: string, title: string, notes: string[]) {
  if (notes[0]) return notes[0];
  return ({
    rsa: "RSA works because multiplying primes is easy, but factoring their product is hard at real sizes.",
    aes: "AES always works on a 4x4 byte state, even when the original message is much longer.",
    des: "DES has 64-bit blocks but only 56 effective key bits because parity bits are not secret.",
    dh: "Both sides compute the same secret without ever sending that secret across the network.",
    ecc: "ECC gets strong security from small keys because scalar multiplication is easy one way and hard to reverse.",
    hash: "A tiny input change should avalanche into a very different digest.",
    mac: "A MAC is not encryption; it proves authenticity and integrity, not secrecy.",
    kdf: "A salt is usually public, but it makes the same password derive different stored values.",
    encoding: "Encoded text may look hidden, but encoding is reversible without a key.",
    attack: "Cryptanalysis often starts by looking for patterns that secure systems should hide.",
    padding: "Padding is part of the security design, not just extra bytes at the end.",
    stream: "Reusing a stream-cipher keystream can reveal relationships between plaintexts.",
    mode: "The mode can be as important as the cipher because it controls IVs, nonces, and authentication.",
    math: "Small arithmetic examples are intentionally tiny versions of the huge numbers used in real cryptography.",
    generic: `${title} is easier to remember if you track inputs, transformation, and output separately.`,
  }[family]);
}

function realUseFor(family: string, title: string) {
  return ({
    rsa: "Used in certificates, signatures, key transport history, and public-key lessons.",
    aes: "Used for file, database, disk, VPN, and browser-backed symmetric encryption.",
    des: "Seen in legacy payment and compatibility systems; useful for Feistel-cipher study.",
    dh: "Used to agree on shared secrets in TLS-style secure sessions.",
    ecc: "Used in modern signatures, key exchange, wallets, SSH, TLS, and mobile protocols.",
    hash: "Used for fingerprints, integrity checks, commitments, and signing workflows.",
    mac: "Used by APIs and protocols to prove a message came from someone with the shared key.",
    kdf: "Used for password storage, key stretching, wallet seeds, and deriving subkeys.",
    encoding: "Used to move binary data through text-only formats such as JSON, URLs, and PEM.",
    attack: "Used to understand what breaks systems so designs can avoid the same weakness.",
    padding: "Used to fit messages into block, RSA, or signature formats safely.",
    stream: "Used where fast byte streams or low-latency encryption are needed.",
    mode: "Used to turn block ciphers into practical encryption schemes for real messages.",
    math: "Used as the arithmetic foundation behind public-key cryptography.",
    generic: `${title} appears in cryptography courses, audits, and implementation checks.`,
  }[family] ?? `${title} appears in cryptography courses, audits, and implementation checks.`);
}

function formulaFor(family: string, title: string) {
  return ({
    rsa: "Public operations use exponent e, private operations use exponent d, and both wrap modulo n.",
    aes: "Each round transforms the state and mixes in a round key.",
    des: "Each Feistel round computes newR = L xor F(R, roundKey), then swaps halves.",
    dh: "Both parties reach g^(ab) mod p from different public values.",
    ecc: "A public key is repeated point addition, written as Q = dG.",
    hash: "Message blocks update an internal state until the final digest is produced.",
    mac: "A tag is recomputed from the same secret key and message to verify authenticity.",
    kdf: "A KDF combines input material, salt, cost, and length to derive key bytes.",
    encoding: "Bytes are regrouped into printable symbols; no secret key is involved.",
    attack: "Compare the visible clue with what a secure design should hide.",
    padding: "Structured bytes are added so a message fits the required format safely.",
    stream: "Ciphertext is plaintext xor keystream.",
    mode: "The mode defines how each block depends on IVs, counters, or previous blocks.",
    math: "Operations wrap around a modulus, like clock arithmetic.",
    generic: `${title} maps inputs through a defined transform to predictable outputs.`,
  }[family] ?? `${title} maps inputs through a defined transform to predictable outputs.`);
}

function mistakesFor(family: string) {
  return ({
    rsa: ["Using raw RSA without OAEP/PSS", "Confusing public and private exponents", "Skipping padding checks"],
    aes: ["Using ECB for repeated data", "Reusing a GCM/CTR nonce", "Choosing a mode without authentication"],
    des: ["Treating DES as modern", "Forgetting the 56-bit effective key limit", "Missing the Feistel swap"],
    dh: ["Skipping authentication", "Using weak groups", "Confusing public values with the final secret"],
    ecc: ["Reusing ECDSA nonces", "Pasting real private keys into tools", "Mixing curve parameters"],
    hash: ["Expecting hashes to decrypt", "Using broken hashes for signatures", "Ignoring collision resistance"],
    mac: ["Thinking MACs hide message content", "Reusing one-time MAC keys", "Comparing tags carelessly"],
    kdf: ["Using no salt", "Using too few iterations or cost", "Treating password hashing as ordinary hashing"],
    encoding: ["Mistaking encoding for encryption", "Dropping padding without knowing receiver rules", "Assuming text and bytes are identical"],
    attack: ["Using too little sample data", "Checking only one clue", "Forgetting attacks show risk, not recommended use"],
    padding: ["Accepting invalid padding silently", "Mixing padding schemes", "Using textbook RSA padding"],
    stream: ["Reusing nonce or keystream", "Using deprecated RC4 for new work", "Confusing keystream with stored randomness"],
    mode: ["Reusing IVs or nonces", "Using encryption without authentication", "Choosing ECB for structured data"],
    math: ["Forgetting the modulus", "Using non-invertible values", "Jumping to large examples too soon"],
    generic: ["Skipping input validation", "Ignoring security status", "Reading only final output without checking the steps"],
  }[family] ?? ["Skipping input validation", "Ignoring security status", "Reading only final output without checking the steps"]);
}

function replayPageAnimation() {
  document.querySelectorAll<HTMLElement>(".changed-byte").forEach((element) => {
    element.style.animation = "none";
    void element.offsetHeight;
    element.style.animation = "";
  });
  window.dispatchEvent(new CustomEvent("algorithm-replay"));
  document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resolveAlgorithm(route: string, category?: string): AlgorithmMetadata | undefined {
  return findAlgorithm(route) ?? algorithmMetadata.find((item) => item.category === category);
}

function flowSteps(algorithm: AlgorithmMetadata | undefined) {
  return [
    algorithm?.inputs?.[0] ?? "Input",
    algorithm?.visualizers?.[0] ?? "Transform",
    algorithm?.outputs?.[0] ?? "Output",
  ];
}

function relatedAlgorithms(route: string, algorithm: AlgorithmMetadata | undefined, status?: SecurityStatus) {
  return algorithmMetadata
    .filter((item) => item.route !== route && (item.category === algorithm?.category || item.securityStatus === status))
    .slice(0, 4);
}

export function SimpleBlockDiagram({
  route,
  title,
  category,
  status,
}: {
  route: string;
  title: string;
  category: string;
  status: SecurityStatus;
}) {
  const algorithm = resolveAlgorithm(route, category);
  const family = familyFor(title, category);
  const steps = flowSteps(algorithm);

  return (
    <section className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4" aria-label={`${title} block diagram`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Before you start</div>
          <h2 className="mt-1 text-base font-bold text-slate-900">Overall flow diagram</h2>
        </div>
        <button type="button" className="btn btn-secondary" onClick={replayPageAnimation} title="Replay this page's walkthrough">
          <RotateCcw className="h-4 w-4" /> Replay
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="contents">
            <div className="rounded-md border border-teal-200 bg-white p-3 shadow-sm">
              <div className="font-mono text-xs font-bold uppercase text-teal-700">Step {index + 1}</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{step}</div>
              <p className="mt-1 text-xs text-slate-600">{index === 0 ? "Start here." : index === 1 ? "Watch what changes." : "Read this after the highlighted steps."}</p>
            </div>
            {index < steps.length - 1 && <div className="hidden items-center justify-center text-slate-400 md:flex"><ArrowRight className="h-5 w-5" /></div>}
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2 lg:grid-cols-3">
        <p className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950"><span className="font-bold">Formula in one sentence:</span> {formulaFor(family, title)}</p>
        <p className="rounded-md border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-950"><span className="font-bold">Real life:</span> {realUseFor(family, title)}</p>
        <p className="rounded-md border border-amber-100 bg-amber-50 p-3 text-sm text-amber-950"><span className="font-bold">Memory fact:</span> {factFor(family, title, algorithm?.notes ?? [])}</p>
      </div>
      <div className={`mt-3 rounded-md border p-3 text-sm ${status === "Modern" ? "border-emerald-200 bg-white text-emerald-900" : "border-amber-200 bg-white text-amber-950"}`}>
        Each active step is highlighted with a stronger border, colored background, or the word Current while you move through the page.
      </div>
    </section>
  );
}

export function StickyFlowReminder({ route, category }: { route: string; category?: string }) {
  const algorithm = resolveAlgorithm(route, category);
  if (!algorithm) return null;
  const steps = flowSteps(algorithm);

  return (
    <section className="sticky top-2 z-20 rounded-md border border-teal-200 bg-white/95 p-3 shadow-sm backdrop-blur" aria-label="Sticky algorithm flow reminder">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal-800"><Map className="h-4 w-4" /> Flow reminder</div>
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex shrink-0 items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{index + 1}. {step}</span>
            {index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-400" />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function AlgorithmLearningFooter({
  route,
  category,
  status,
}: {
  route: string;
  category?: string;
  status?: SecurityStatus;
}) {
  const algorithm = resolveAlgorithm(route, category);
  if (!algorithm) return null;
  const family = familyFor(algorithm.label, algorithm.category);
  const steps = flowSteps(algorithm);
  const related = relatedAlgorithms(route, algorithm, status ?? algorithm.securityStatus);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm" aria-label={`${algorithm.label} page summary`}>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600"><BookOpen className="h-4 w-4" /> Summary</div>
          <p className="mt-2 text-sm text-slate-700">{algorithm.label} started with {steps[0].toLowerCase()}, applied {steps[1].toLowerCase()}, and ended by checking {steps[2].toLowerCase()}.</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-900"><TriangleAlert className="h-4 w-4" /> Common Mistakes</div>
          <div className="mt-2 grid gap-2">
            {mistakesFor(family).slice(0, 3).map((mistake) => <div key={mistake} className="rounded-md border border-amber-200 bg-white/80 p-2 text-sm font-medium text-amber-950">{mistake}</div>)}
          </div>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-900"><Lightbulb className="h-4 w-4" /> Learn Next</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((item) => (
              <Link key={item.route} to={item.route} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-950 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-950">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
