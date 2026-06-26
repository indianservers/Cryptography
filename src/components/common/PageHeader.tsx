import type { SecurityStatus } from "../../types";
import { useEffect, useState } from "react";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { Link, useLocation } from "react-router-dom";
import { algorithmMetadata, findAlgorithm } from "../../data/algorithmMetadata";
import { getBrowserSupport, getImplementationStatus } from "../../data/implementationStatus";
import { BrowserSupportBadge, ImplementationBadge } from "./ImplementationBadge";
import { AlgorithmSpecificEnhancements } from "./AlgorithmSpecificEnhancements";
import { getModuleAuditEntry } from "../../data/moduleAuditRegistry";
import {
  getAccuracyLabel,
  getAccuracyTone,
  getVerificationLabel,
  getVerificationTone,
  shouldShowEducationalBoundary,
  shouldShowSecretInputWarning,
} from "../../lib/auditStatus";
import { SafetyBoundaryCard } from "./SafetyBoundaryCard";
import { ModuleLearningSection } from "./ModuleLearningSection";

const categoryTone = (category: string) => {
  if (/symmetric|block/i.test(category)) return "border-teal-200 bg-teal-50 text-teal-800";
  if (/mathematics|math/i.test(category)) return "border-blue-200 bg-blue-50 text-blue-800";
  if (/stream/i.test(category)) return "border-cyan-200 bg-cyan-50 text-cyan-800";
  if (/public|rsa|elgamal|rabin/i.test(category)) return "border-indigo-200 bg-indigo-50 text-indigo-800";
  if (/curve|ecc|ecd/i.test(category)) return "border-violet-200 bg-violet-50 text-violet-800";
  if (/hash/i.test(category)) return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800";
  if (/mac/i.test(category)) return "border-rose-200 bg-rose-50 text-rose-800";
  if (/derivation|kdf/i.test(category)) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (/attack|cryptanalysis/i.test(category)) return "border-red-200 bg-red-50 text-red-800";
  if (/padding/i.test(category)) return "border-amber-200 bg-amber-50 text-amber-900";
  if (/encoding/i.test(category)) return "border-lime-200 bg-lime-50 text-lime-800";
  return "border-sky-200 bg-sky-50 text-sky-800";
};

const tabs = ["Overview", "Interactive Demo", "Step-by-Step", "Security Notes", "Test Vectors"].map((label) => ({
  label,
  id: label.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, ""),
}));

const familyFor = (title: string, category: string) => {
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
};

const realUseFor = (family: string, title: string) => ({
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

const factFor = (family: string, title: string, notes: string[]) => {
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
};

const formulaFor = (family: string, title: string) => ({
  rsa: "Formula idea: public operations use exponent e, private operations use exponent d, both modulo n.",
  aes: "Formula idea: each round transforms the state, then mixes in a round key.",
  des: "Formula idea: each Feistel round computes newR = L xor F(R, roundKey), then swaps halves.",
  dh: "Formula idea: g^(ab) mod p is reached from both sides.",
  ecc: "Formula idea: public keys come from repeated point addition, written as Q = dG.",
  hash: "Formula idea: blocks update an internal state until the final digest is produced.",
  mac: "Formula idea: tag = MAC(secret key, message), and verification recomputes the same tag.",
  kdf: "Formula idea: derived key = KDF(password, salt, cost, length).",
  encoding: "Formula idea: bytes are regrouped into printable symbols; no secret key is involved.",
  attack: "Formula idea: compare the observed pattern with the pattern a secure design should have hidden.",
  padding: "Formula idea: add structured bytes so the message fits the required block or encoded format.",
  stream: "Formula idea: ciphertext = plaintext xor keystream.",
  mode: "Formula idea: the mode defines how each block depends on IVs, counters, or previous blocks.",
  math: "Formula idea: operations wrap around a modulus, like clock arithmetic.",
  generic: `Formula idea: ${title} maps inputs through a defined transform to predictable outputs.`,
}[family] ?? `Formula idea: ${title} maps inputs through a defined transform to predictable outputs.`);

const complexityFor = (family: string) => ({
  rsa: "Complexity: classroom RSA uses tiny integers, but real RSA cost grows quickly with key size.",
  aes: "Complexity: AES work grows with block count and round count; each block is fixed at 16 bytes.",
  des: "Complexity: DES is fast, but its 56-bit key space is small enough to brute force.",
  dh: "Complexity: modular exponentiation dominates the work, so larger groups cost more.",
  ecc: "Complexity: scalar multiplication dominates the work, but ECC reaches strong security with smaller keys.",
  hash: "Complexity: hashing scans each input block once, so longer messages take proportionally more work.",
  mac: "Complexity: MAC cost usually follows the underlying hash or block cipher plus key setup.",
  kdf: "Complexity: KDFs intentionally add cost so password guessing becomes slower.",
  encoding: "Complexity: encoding is linear; each byte is regrouped or rewritten once.",
  attack: "Complexity: attacks get harder as key space, sample quality, and noise increase.",
  padding: "Complexity: padding is small overhead, but validation mistakes can create serious bugs.",
  stream: "Complexity: stream ciphers generate keystream bytes as needed, so cost grows with message length.",
  mode: "Complexity: modes add chaining, counters, or authentication around block-cipher work.",
  math: "Complexity: small examples show the rule; real cryptography uses much larger numbers.",
  generic: "Complexity: this visualization favors clear steps over raw throughput.",
}[family] ?? "Complexity: this visualization favors clear steps over raw throughput.");

const mistakesFor = (family: string) => ({
  rsa: ["Using raw RSA without OAEP/PSS", "Confusing public and private exponents", "Testing only huge numbers before learning the toy case"],
  aes: ["Using ECB for repeated data", "Reusing a GCM/CTR nonce", "Choosing the wrong key length"],
  des: ["Treating DES as modern", "Forgetting the 56-bit effective key limit", "Missing Feistel swaps"],
  dh: ["Skipping authentication", "Using weak groups", "Confusing public values with the final secret"],
  ecc: ["Reusing ECDSA nonces", "Pasting real private keys into tools", "Mixing curve parameters"],
  hash: ["Using broken hashes for signatures", "Expecting hashes to decrypt", "Ignoring collision resistance"],
  mac: ["Comparing tags unsafely", "Reusing one-time MAC keys", "Thinking MACs hide message content"],
  kdf: ["Using no salt", "Using too few iterations or cost", "Treating password hashing as ordinary hashing"],
  encoding: ["Mistaking encoding for encryption", "Dropping padding without knowing receiver rules", "Assuming text and bytes are identical"],
  attack: ["Using too little sample data", "Checking only one clue", "Forgetting attacks show risk, not recommended use"],
  padding: ["Accepting invalid padding silently", "Mixing padding schemes", "Using textbook RSA padding"],
  stream: ["Reusing nonce or keystream", "Not discarding deprecated RC4 use", "Confusing stream bytes with random storage"],
  mode: ["Reusing IVs/nonces", "Using encryption without authentication", "Choosing ECB for structured data"],
  math: ["Forgetting the modulus", "Using non-invertible values", "Jumping to large examples too soon"],
  generic: ["Skipping input validation", "Ignoring security status", "Reading only final output without checking the steps"],
}[family] ?? ["Skipping input validation", "Ignoring security status", "Reading only final output without checking the steps"]);

const tooltipFor = (term: string) => {
  const lower = term.toLowerCase();
  if (lower.includes("nonce")) return "Nonce: a number used once; reuse can break some algorithms.";
  if (lower.includes("iv")) return "IV: initialization vector used to start a mode of operation.";
  if (lower.includes("salt")) return "Salt: public value that makes repeated passwords derive different outputs.";
  if (lower.includes("key")) return "Key: secret or public parameter controlling the cryptographic operation.";
  if (lower.includes("tag") || lower.includes("mac")) return "Tag/MAC: value used to check authenticity and integrity.";
  if (lower.includes("hash") || lower.includes("digest")) return "Hash/digest: fixed-size fingerprint of input data.";
  if (lower.includes("round")) return "Round: one repeated internal transformation step.";
  if (lower.includes("cipher")) return "Cipher: algorithm that transforms plaintext and ciphertext using a key.";
  return `${term}: ${term} in this page's cryptographic flow.`;
};

function replayPageAnimation() {
  document.querySelectorAll<HTMLElement>(".changed-byte").forEach((element) => {
    element.style.animation = "none";
    void element.offsetHeight;
    element.style.animation = "";
  });
  window.dispatchEvent(new CustomEvent("algorithm-replay"));
  document.getElementById("overview")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function PageHeader({ title, category, status, children }: { title: string; category: string; status: SecurityStatus; children: React.ReactNode }) {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(tabs[0].id);
  const [visibleTabs, setVisibleTabs] = useState(tabs.slice(0, 1));
  const algorithm = findAlgorithm(location.pathname);
  const route = algorithm?.route ?? location.pathname;
  const auditEntry = getModuleAuditEntry(route);
  const family = familyFor(title, category);
  const flowSteps = [
    algorithm?.inputs?.[0] ?? "Input",
    algorithm?.visualizers?.[0] ?? "Transform",
    algorithm?.outputs?.[0] ?? "Output",
  ];
  const related = algorithmMetadata
    .filter((item) => item.route !== route && (item.category === algorithm?.category || item.securityStatus === status))
    .slice(0, 3);
  const safeMessage = status === "Modern"
    ? "Safe with correct parameters, unique nonces or IVs, and authenticated use where required."
    : status === "Legacy"
      ? "Legacy choice. Prefer a modern primitive for new designs."
      : status === "Deprecated"
        ? "Deprecated. Keep this for study, migration, or compatibility only."
        : "Educational or unsafe if misused. Do not treat demo settings as production guidance.";

  useEffect(() => {
    const existingTabs = tabs.filter((tab) => document.getElementById(tab.id));
    setVisibleTabs(existingTabs.length ? existingTabs : tabs.slice(0, 1));
    setActiveSection(existingTabs[0]?.id ?? tabs[0].id);
    const sections = existingTabs.map((tab) => document.getElementById(tab.id)).filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.35, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <header id="overview" className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryTone(category)}`}>{category}</span>
        <SecurityStatusBadge status={status} />
        <ImplementationBadge status={getImplementationStatus(route)} />
        <BrowserSupportBadge support={getBrowserSupport(route)} />
        {auditEntry && (
          <>
            <span title={`Accuracy: ${getAccuracyLabel(auditEntry.implementationAccuracy)}`} className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getAccuracyTone(auditEntry.implementationAccuracy)}`}>
              {getAccuracyLabel(auditEntry.implementationAccuracy)}
            </span>
            <span title={`Verification: ${getVerificationLabel(auditEntry.verificationStatus)}`} className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getVerificationTone(auditEntry.verificationStatus)}`}>
              {getVerificationLabel(auditEntry.verificationStatus)}
            </span>
          </>
        )}
      </div>
      <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h1>
      <div className="mt-1 text-sm font-semibold text-slate-500">Category: {category}</div>
      <p className="mt-3 max-w-4xl text-slate-600">{children}</p>
      {auditEntry && (
        <SafetyBoundaryCard
          className="mt-4"
          educationalOnly={shouldShowEducationalBoundary(auditEntry)}
          deprecatedUnsafe={auditEntry.securityUseStatus === "DEPRECATED" || auditEntry.securityUseStatus === "UNSAFE"}
          attackConcept={auditEntry.securityUseStatus === "ATTACK_CONCEPT_ONLY"}
          secretInputRisk={shouldShowSecretInputWarning(auditEntry)}
          productionNotAllowed={auditEntry.securityUseStatus !== "MODERN_SAFE_WHEN_USED_CORRECTLY" || auditEntry.implementationAccuracy !== "OFFICIAL_OR_WEBCRYPTO"}
          vectorVerificationPending={auditEntry.verificationStatus === "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT" || auditEntry.verificationStatus === "MANUAL_QA_REQUIRED" || auditEntry.verificationStatus === "NO_TEST_COVERAGE"}
          genericShell={auditEntry.currentPageType === "generic-shell"}
        />
      )}
      <ModuleLearningSection route={route} />
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Key inputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.inputs ?? ["Inputs vary by page"]).slice(0, 5).map((input) => <span key={input} title={tooltipFor(input)} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">{input}</span>)}</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Outputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.outputs ?? ["Computed result"]).slice(0, 5).map((output) => <span key={output} title={tooltipFor(output)} className="rounded border border-teal-100 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-900 shadow-sm">{output}</span>)}</div>
        </div>
        <div className={`rounded-md border p-3 text-sm ${status === "Modern" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <div className="text-xs font-semibold uppercase">{status === "Modern" ? "Security status" : "Usage guidance"}</div>
          <p className="mt-1">{safeMessage}</p>
        </div>
      </div>
      <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 text-sm">
        {visibleTabs.map((tab) => <a key={tab.id} href={`#${tab.id}`} aria-current={activeSection === tab.id ? "location" : undefined} className={`shrink-0 rounded-md border px-3 py-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${activeSection === tab.id ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"}`}>{tab.label}</a>)}
      </nav>
      <section className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Before you start</h2>
            <button type="button" className="btn btn-secondary" onClick={replayPageAnimation}>Replay</button>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {flowSteps.map((step, index) => (
              <div key={`${step}-${index}`} className="rounded-md border border-teal-100 bg-white p-3 text-sm">
                <div className="font-mono text-xs text-teal-700">step {index + 1}</div>
                <div className="mt-1 font-semibold text-slate-800">{step}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-700">{formulaFor(family, title)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Did You Know? / Remember this</h2>
          <p className="mt-2 text-sm text-slate-700">{factFor(family, title, algorithm?.notes ?? [])}</p>
          <div className="mt-3 rounded-md border border-sky-100 bg-sky-50 p-3 text-sm text-sky-900">{realUseFor(family, title)}</div>
          <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{complexityFor(family)}</div>
        </div>
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-2">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-900">Common mistakes</h2>
          <div className="mt-3 grid gap-2">
            {mistakesFor(family).map((mistake) => <div key={mistake} className="rounded-md border border-amber-200 bg-white/70 p-2 text-sm font-medium text-amber-950">{mistake}</div>)}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Algorithm comparison</h2>
          <p className="mt-2 text-sm text-slate-700">{title} takes {flowSteps[0].toLowerCase()}, applies {flowSteps[1].toLowerCase()}, and checks {flowSteps[2].toLowerCase()}.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => <Link key={item.route} title={`${item.label}: ${item.intro}`} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900" to={item.route}>{item.label}</Link>)}
          </div>
          <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">What to learn next</div>
        </div>
      </section>
      <AlgorithmSpecificEnhancements title={title} category={category} status={status} />
    </header>
  );
}
