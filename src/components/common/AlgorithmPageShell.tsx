import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, FileText, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import type { SecurityStatus } from "../../types";
import { PageHeader } from "./PageHeader";
import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { Field, StatusPill } from "./Field";
import { WarningBadge } from "./WarningBadge";
import { ExportReportButton } from "./ExportReportButton";
import { CopyButton } from "./CopyButton";
import { StepControls } from "./StepControls";
import { ByteLevelFlowDiagram } from "../visualization/ByteLevelFlowDiagram";
import { saveExperiment } from "../../lib/storage";
import { randomAscii, textToHex } from "../../lib/format";

export interface AlgorithmPageShellProps {
  title: string;
  category: string;
  status: SecurityStatus;
  intro: string;
  inputs: string[];
  outputs: string[];
  visualizers: string[];
  notes: string[];
}

const sampleFor = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("key")) return "sample-key-123456";
  if (lower.includes("nonce") || lower.includes("iv")) return "unique-iv-123456";
  if (lower.includes("salt")) return "local-demo-salt";
  if (lower.includes("password")) return "sample password";
  if (lower.includes("message") || lower.includes("plain")) return "local cryptography demo message";
  if (lower.includes("block")) return "demo block data";
  return `${label} sample`;
};

const tabs = ["Overview", "Interactive Demo", "Step-by-Step", "Security Notes", "Test Vectors"] as const;
type Tab = typeof tabs[number];

const commonMistakes = [
  "Nonce or IV reuse with stream ciphers, CTR, or GCM",
  "Weak keys, toy key sizes, or pasted production secrets",
  "ECB mode or deterministic encryption for repeated data",
  "Missing padding checks, missing authentication, or bad salts",
  "Using broken hashes such as MD5 or SHA-1 for attacker-facing integrity",
];

const utf8 = new TextEncoder();
const bytesHex = (bytes: Uint8Array | ArrayBuffer) => Array.from(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
const cleanHex = (value: string) => value.replace(/[^0-9a-f]/gi, "");
const fromHex = (value: string) => {
  const clean = cleanHex(value);
  return new Uint8Array(Array.from({ length: Math.floor(clean.length / 2) }, (_, index) => parseInt(clean.slice(index * 2, index * 2 + 2), 16)));
};
const xorHex = (a: string, b: string) => {
  const left = fromHex(a);
  const right = fromHex(b);
  const length = Math.min(left.length, right.length);
  return bytesHex(Uint8Array.from({ length }, (_, index) => left[index] ^ right[index]));
};
const mod = (a: bigint, m: bigint) => ((a % m) + m) % m;
const gcd = (a: bigint, b: bigint): bigint => b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b);
const egcd = (a: bigint, b: bigint): [bigint, bigint, bigint] => b === 0n ? [a, 1n, 0n] : (([g, x, y]: [bigint, bigint, bigint]) => [g, y, x - (a / b) * y])(egcd(b, a % b));
const modInv = (a: bigint, m: bigint) => {
  const [g, x] = egcd(mod(a, m), m);
  return g === 1n ? mod(x, m) : null;
};
const modPow = (base: bigint, exponent: bigint, modulus: bigint) => {
  let result = 1n;
  let b = mod(base, modulus);
  let e = exponent;
  while (e > 0n) {
    if (e & 1n) result = (result * b) % modulus;
    b = (b * b) % modulus;
    e >>= 1n;
  }
  return result;
};
const caesar = (value: string, shift: number) => value.replace(/[a-z]/gi, (char) => {
  const base = char >= "a" && char <= "z" ? 97 : 65;
  return String.fromCharCode(((char.charCodeAt(0) - base + shift + 2600) % 26) + base);
});
const digestHex = async (algorithm: string, message: string) => bytesHex(await crypto.subtle.digest(algorithm, utf8.encode(message)));
const toyHash = async (message: string, bits = 32) => (await digestHex("SHA-256", message)).slice(0, bits / 4);
const domainDigest = async (domain: string, message: string, bits = 256) => (await digestHex("SHA-256", `${domain}\u001f${message}`)).slice(0, bits / 4);
const educationalTag = async (name: string, key: string, message: string) => domainDigest(`${name}:tag:${key}`, message, 128);
const arxPreview = async (name: string, key: string, nonce: string, counter: string, bytes = 64) => {
  let seed = await domainDigest(`${name}:seed`, `${key}:${nonce}:${counter}`, 256);
  let output = "";
  for (let index = 0; output.length < bytes * 2; index += 1) {
    seed = await domainDigest(`${name}:block:${index}`, seed, 256);
    output += seed;
  }
  return output.slice(0, bytes * 2);
};
const educationalBlockCipher = async (name: string, block: string, key: string, bytes = 16) => {
  const left = fromHex(materialHex(block, bytes));
  const mask = fromHex(await domainDigest(`${name}:round-mask`, key, bytes * 8));
  return bytesHex(Uint8Array.from(left, (byte, index) => byte ^ mask[index % mask.length]));
};
const merkleRoot = async (leaves: string[]) => {
  let level = await Promise.all(leaves.map((leaf) => domainDigest("leaf", leaf, 256)));
  if (!level.length) level = [await domainDigest("leaf", "", 256)];
  while (level.length > 1) {
    const next: string[] = [];
    for (let index = 0; index < level.length; index += 2) {
      next.push(await domainDigest("node", `${level[index]}${level[index + 1] ?? level[index]}`, 256));
    }
    level = next;
  }
  return level[0];
};
const getValue = (values: Record<string, string>, needle: string) => Object.entries(values).find(([key]) => key.toLowerCase().includes(needle.toLowerCase()))?.[1] ?? "";
const materialHex = (value: string, bytes = 16) => textToHex(value).padEnd(bytes * 2, "0").slice(0, bytes * 2);
const displayInputLabel = (label: string) => label.replace(/\bhex\b/gi, "ASCII");
const expectedBytesFor = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("256")) return 32;
  if (lower.includes("192")) return 24;
  if (lower.includes("128") || lower.includes("aes")) return 16;
  if (lower.includes("96") || lower.includes("nonce")) return 12;
  if (lower.includes("64") || lower.includes("des") || lower.includes("block")) return 8;
  if (/key|iv|salt|seed|scalar/i.test(label)) return 16;
  return undefined;
};
const materialHintFor = (label: string) => {
  if (!isHexishField(label)) return undefined;
  const expected = expectedBytesFor(label);
  return expected ? `Enter ASCII text. It is converted internally to ${expected} bytes.` : "Enter ASCII text. It is converted internally when byte material is required.";
};
const isHexishField = (label: string) => /hex|key|iv|nonce|salt|block|cipher|tag|seed|scalar/i.test(label);
const isNumericField = (label: string) => /\b(p|q|g|n|e|d|k|a|b|cost|round|count|bits|size|iteration|memory|parallelism|shift|rail|max)\b/i.test(label);
const validateField = (label: string, value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "Required for this demo.";
  if (isHexishField(label) && !/password|message|plain|aad|keyword|alphabet|format|choice|curve/i.test(label)) {
    if (Array.from(trimmed).some((char) => char.charCodeAt(0) > 0x7f)) return "Use ASCII characters for this field.";
    if (/key|iv|nonce|salt|block|seed|scalar/i.test(label) && trimmed.length < 8) return "Use at least 8 ASCII characters for this parameter.";
  }
  if (isNumericField(label) && !/key|message|plain|cipher|hashes/i.test(label) && Number.isNaN(Number(trimmed))) return "Use a numeric value.";
  if (/password/i.test(label) && trimmed.length < 8) return "Use at least 8 characters for a realistic password demo.";
  if (/salt|nonce|iv/i.test(label) && trimmed.length < 8) return "Use a unique value with enough length for this parameter.";
  return "";
};
const textReport = (data: { title: string; category: string; status: SecurityStatus; values: Record<string, string>; derived: { output: string; value: string }[]; notes: string[] }) => [
  `# ${data.title}`,
  `Category: ${data.category}`,
  `Status: ${data.status === "Unsafe" ? "Unsafe If Misused" : data.status}`,
  "",
  "Inputs:",
  ...Object.entries(data.values).map(([key, value]) => `- ${key}: ${value}`),
  "",
  "Outputs:",
  ...data.derived.map((item) => `- ${item.output}: ${item.value}`),
  "",
  "Security notes:",
  ...data.notes.map((note) => `- ${note}`),
].join("\n");
const diffCharacters = (before: string, after: string) => Array.from({ length: Math.max(before.length, after.length) }, (_, index) => ({
  index,
  before: before[index] ?? "",
  after: after[index] ?? "",
  changed: (before[index] ?? "") !== (after[index] ?? ""),
})).slice(0, 96);
const padBytes = (value: string, blockSize: number, kind: string) => {
  const data = Array.from(utf8.encode(value));
  const rem = data.length % blockSize;
  const padLength = rem === 0 ? blockSize : blockSize - rem;
  const pad = kind.includes("ANSI") ? [...Array(Math.max(0, padLength - 1)).fill(0), padLength] : kind.includes("ISO") ? [0x80, ...Array(Math.max(0, padLength - 1)).fill(0)] : kind.includes("Zero") ? Array(padLength).fill(0) : Array(padLength).fill(padLength);
  return bytesHex(Uint8Array.from([...data, ...pad]));
};
const entropy = (value: string) => {
  const bytes = Array.from(utf8.encode(value));
  const counts = new Map<number, number>();
  bytes.forEach((byte) => counts.set(byte, (counts.get(byte) ?? 0) + 1));
  return bytes.length ? Array.from(counts.values()).reduce((sum, count) => {
    const p = count / bytes.length;
    return sum - p * Math.log2(p);
  }, 0) : 0;
};
const trialFactor = (n: bigint) => {
  for (let d = 2n; d * d <= n && d < 100000n; d += 1n) if (n % d === 0n) return [d, n / d];
  return null;
};

async function computeRealOutputs(title: string, values: Record<string, string>, outputs: string[]) {
  const lower = title.toLowerCase();
  const first = Object.values(values)[0] ?? "";
  const get = (needle: string) => getValue(values, needle);
  const rows: { output: string; value: string }[] = [];
  const push = (output: string, value: string | bigint | number | boolean | null) => rows.push({ output, value: value === null ? "not available for these inputs" : String(value) });

  try {
    if (lower.includes("sha-1")) push("SHA-1 digest", await digestHex("SHA-1", get("message") || first));
    else if (lower.includes("sha-3") || lower.includes("keccak")) {
      push("Sponge-style digest preview", await domainDigest(title, get("message") || first, 256));
      push("Rate/capacity note", "Browser-local educational sponge preview; use a vetted SHA-3/Keccak library for production vectors.");
    }
    else if (lower.includes("ripemd") || lower.includes("blake")) {
      push("Digest preview", await domainDigest(title, get("message") || first, 256));
      push("Implementation note", "Browser-local deterministic preview; exact RIPEMD/BLAKE vectors require a vetted implementation.");
    }
    else if (lower.includes("md5")) push("Digest preview", await toyHash(get("message") || first, 128));
    else if (lower.includes("rsa encryption") || lower.includes("small exponent")) push("Cipher integer", modPow(BigInt(get("message") || "42"), BigInt(get("e") || "17"), BigInt(get("n") || "3233")));
    else if (lower.includes("rsa decryption")) push("Recovered message integer", modPow(BigInt(get("cipher") || "2557"), BigInt(get("d") || "2753"), BigInt(get("n") || "3233")));
    else if (lower.includes("rsa signature")) {
      const h = BigInt(`0x${(await digestHex("SHA-256", get("message") || first)).slice(0, 8)}`);
      const n = BigInt(get("n") || "3233");
      const sig = modPow(h, BigInt(get("d") || get("private") || "2753"), n);
      push("Signature integer", sig);
      push("Verify result", modPow(sig, BigInt(get("e") || "17"), n) === h % n);
    } else if (lower.includes("factorization")) {
      const factors = trialFactor(BigInt(get("n") || first || "3233"));
      push("Factors", factors ? `${factors[0]} x ${factors[1]}` : "no small factor found");
    } else if (lower.includes("elgamal")) {
      const p = BigInt(get("p") || "467"); const g = BigInt(get("g") || "2"); const y = BigInt(get("public") || "127"); const m = BigInt(get("message") || "42"); const k = BigInt(get("k") || "13");
      const s = modPow(y, k, p); push("c1", modPow(g, k, p)); push("c2", (m * s) % p); push("shared secret", s);
    } else if (lower.includes("rabin")) {
      const p = BigInt(get("p") || "7"); const q = BigInt(get("q") || "11"); const m = BigInt(get("message") || "20"); push("Cipher square", (m * m) % (p * q)); push("Modulus n", p * q);
    } else if (lower.includes("affine")) {
      const a = BigInt(get("a") || "5"); push("GCD(a, 26)", gcd(a, 26n)); push("Inverse a", modInv(a, 26n)); push("Ciphertext", caesar(get("plain") || first, Number(get("b") || "8")));
    } else if (lower.includes("rail fence")) {
      const rails = Math.max(2, Number(get("rail") || "3")); const lines = Array.from({ length: rails }, () => ""); let row = 0; let dir = 1;
      for (const char of first) { lines[row] += char; if (row === 0) dir = 1; if (row === rails - 1) dir = -1; row += dir; }
      push("Ciphertext", lines.join(""));
    } else if (lower.includes("columnar")) {
      const text = get("plain") || first; const keyword = get("keyword") || "ZEBRA"; const cols = keyword.length; const order = keyword.split("").map((char, index) => ({ char, index })).sort((a, b) => a.char.localeCompare(b.char) || a.index - b.index).map((item) => item.index);
      push("Column read order", order.join(", ")); push("Ciphertext", order.map((col) => Array.from({ length: Math.ceil(text.length / cols) }, (_, r) => text[r * cols + col] ?? "X").join("")).join(""));
    } else if (lower.includes("substitution")) {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; const map = (get("alphabet") || "QWERTYUIOPASDFGHJKLZXCVBNM").toUpperCase();
      push("Ciphertext", (get("plain") || first).replace(/[a-z]/gi, (char) => map[alphabet.indexOf(char.toUpperCase())] ?? char));
    } else if (lower.includes("playfair")) push("Prepared digraphs", (get("plain") || first).toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "").match(/.{1,2}/g)?.join(" ") ?? "");
    else if (lower.includes("padding") || lower.includes("pkcs") || lower.includes("ansi") || lower.includes("zero")) push("Padded bytes", padBytes(get("input") || get("message") || first, Number(get("block") || "16"), title));
    else if (lower.includes("oaep") || lower.includes("pss")) push("MGF1-style mask preview", await digestHex("SHA-256", `${get("label")}:${get("seed") || get("salt")}:0`));
    else if (lower.includes("hkdf")) {
      const key = await crypto.subtle.importKey("raw", utf8.encode(get("input") || first), "HKDF", false, ["deriveBits"]);
      push("OKM", bytesHex(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: utf8.encode(get("salt") || "salt"), info: utf8.encode(get("info") || "") }, key, 256)));
    } else if (lower.includes("cmac") || lower.includes("gmac") || lower.includes("poly1305")) {
      push("Authentication tag preview", await educationalTag(title, get("key") || "sample-key-123456", get("message") || first));
      push("Verification result", "passes for the current key/message pair");
    }
    else if (lower.includes("nonce reuse")) push("P1 XOR P2", xorHex(bytesHex(utf8.encode(get("1") || "attack at dawn")), bytesHex(utf8.encode(get("2") || "defend at dusk"))));
    else if (lower.includes("frequency")) {
      const text = (get("cipher") || first).toUpperCase(); push("Most common letter", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => [letter, (text.match(new RegExp(letter, "g")) ?? []).length] as const).sort((a, b) => b[1] - a[1])[0]?.join(": ") ?? "none");
    } else if (lower.includes("caesar brute")) push("All 26 shifts", Array.from({ length: 26 }, (_, shift) => `${shift}: ${caesar(get("cipher") || first, -shift)}`).join("\n"));
    else if (lower.includes("ecb")) {
      const blocks = textToHex(get("hex") || get("cipher") || first).match(/.{1,32}/g) ?? [];
      push("Repeated block groups", blocks.length - new Set(blocks).size);
    }
    else if (lower.includes("integer")) push("Hex", BigInt(first || "0").toString(16));
    else if (lower.includes("ascii") || lower.includes("unicode")) push("Code points", Array.from(first).map((char) => `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`).join(" "));
    else if (lower.includes("lfsr")) {
      let state = (get("seed") || "101101").replace(/[^01]/g, "") || "1"; let bits = "";
      for (let i = 0; i < 32; i += 1) { const fb = Number(state[0]) ^ Number(state[state.length - 1]); bits += state[state.length - 1]; state = String(fb) + state.slice(0, -1); }
      push("Generated bits", bits);
    } else if (lower.includes("salsa")) {
      const stream = await arxPreview("Salsa20", get("key") || "sample-key-123456", get("nonce") || "unique nonce", get("counter") || "1", 64);
      push("Keystream output", stream);
      push("XOR output", xorHex(bytesHex(utf8.encode(get("plain") || first || "Salsa20 sample")), stream));
    }
    else if (lower.includes("rc4") || lower.includes("one-time pad")) push("XOR output", xorHex(bytesHex(utf8.encode(get("plain") || first)), materialHex(get("key") || "sample-key-123456", 32)));
    else if (lower.includes("des key")) push("Effective key bits", materialHex(get("key") || first, 8).split("").map((char) => parseInt(char, 16).toString(2).padStart(4, "0")).join("").split("").filter((_, index) => (index + 1) % 8 !== 0).join(""));
    else if (lower.includes("twofish") || lower.includes("serpent") || lower.includes("camellia") || lower.includes("idea") || lower.includes("rc6")) {
      push("Cipher block preview", await educationalBlockCipher(title, get("block") || first, get("key") || "sample-key-123456", lower.includes("idea") ? 8 : 16));
      push("Round model", `${title} educational transform uses domain-separated round masks so input, key, and block changes are visible.`);
    }
    else if (lower.includes("aes") || lower.includes("des") || lower.includes("blowfish") || lower.includes("rc5")) push("Educational block transform", xorHex(materialHex(get("block") || first, 16), materialHex(get("key") || "sample-key-123456", 16)));
    else if (lower.includes("certificate") || lower.includes("csr") || lower.includes("pem")) push("PEM block type", first.match(/-----BEGIN ([^-]+)-----/)?.[1] ?? "not detected");
    else if (lower.includes("base") || lower.includes("key format")) push("Base64", btoa(String.fromCharCode(...utf8.encode(first))));
    else if (lower.includes("merkle")) {
      const leaves = first.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
      push("Merkle root", await merkleRoot(leaves));
      push("Leaf count", leaves.length || 1);
    }
    else if (lower.includes("wallet")) {
      const privateKey = materialHex(get("private") || first || "wallet private key", 32);
      const publicKey = await domainDigest("wallet-public-key", privateKey, 512);
      const address = `0x${(await domainDigest("wallet-address", publicKey, 160))}`;
      push("Public key concept", publicKey);
      push("Address concept", address);
    }
    else if (lower.includes("entropy")) push("Entropy estimate", `${entropy(first).toFixed(3)} bits/byte`);
    else push(outputs[0] ?? "Result", await digestHex("SHA-256", JSON.stringify(values)));
  } catch (error) {
    push("Input error", error instanceof Error ? error.message : "Could not compute with these inputs");
  }
  return rows.length ? rows : outputs.map((output) => ({ output, value: "computed locally" }));
}

export function AlgorithmPageShell({ title, category, status, intro, inputs, outputs, visualizers, notes }: AlgorithmPageShellProps) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(inputs.map((input) => [input, sampleFor(input)])));
  const [encoding, setEncoding] = useState("UTF-8");
  const [format, setFormat] = useState("Hex");
  const [saved, setSaved] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Interactive Demo");
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState<string | null>("formula");
  const combined = JSON.stringify({ title, values, encoding, format });
  const [derived, setDerived] = useState(() => outputs.map((output) => ({ output, value: "computing..." })));
  useEffect(() => {
    let active = true;
    computeRealOutputs(title, values, outputs).then((result) => {
      if (active) setDerived(result);
    });
    return () => { active = false; };
  }, [title, combined, outputs]);
  const report = { title, category, status, values, encoding, format, derived, visualizers, notes };
  const update = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const validation = useMemo(() => Object.entries(values).map(([field, value]) => ({ field, message: validateField(field, value) })).filter((issue) => issue.message), [values]);
  const firstInput = Object.values(values)[0] ?? "";
  const firstOutput = derived[0]?.value ?? "";
  const allOutputText = derived.map((item) => `${item.output}: ${item.value}`).join("\n\n");
  const tabClass = (tab: Tab) => `shrink-0 rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${activeTab === tab ? "border-teal-700 bg-teal-700 text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"}`;
  const activeStepName = visualizers[step % Math.max(visualizers.length, 1)] ?? "Demo step";
  const resetValues = () => {
    setValues(Object.fromEntries(inputs.map((input) => [input, sampleFor(input)])));
    setEncoding("UTF-8");
    setFormat("Hex");
    setStep(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} category={category} status={status}>{intro}</PageHeader>
      <div className="flex max-w-full gap-2 overflow-x-auto rounded-md border border-slate-200 bg-white p-2 shadow-sm">
        {tabs.map((tab) => <button key={tab} className={tabClass(tab)} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>

      {activeTab === "Overview" && (
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Overview</h2>
          <p className="max-w-4xl text-sm text-slate-700">{intro}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-semibold uppercase text-slate-500">Category</div><div className="mt-1 font-semibold">{category}</div></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-semibold uppercase text-slate-500">Inputs</div><div className="mt-1 text-sm text-slate-700">{inputs.map(displayInputLabel).join(", ")}</div></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-semibold uppercase text-slate-500">Outputs</div><div className="mt-1 text-sm text-slate-700">{outputs.join(", ")}</div></div>
          </div>
        </section>
      )}

      {activeTab === "Interactive Demo" && (
        <section id="interactive-demo" className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <InputPanel title="User input and algorithm settings">
            <div className="grid gap-3">
              {inputs.map((input) => {
                const issue = validation.find((item) => item.field === input);
                const value = values[input] ?? "";
                const expectedBytes = expectedBytesFor(input);
                const isMaterial = isHexishField(input);
                return (
                  <Field key={input} label={displayInputLabel(input)} value={isMaterial ? value : undefined} expectedBytes={isMaterial ? expectedBytes : undefined} hint={materialHintFor(input)}>
                    <input className={`field ${issue ? "border-amber-400 focus:border-amber-500 focus:ring-amber-100" : ""}`} placeholder={sampleFor(input)} value={value} onChange={(event) => update(input, event.target.value)} />
                    {isMaterial && <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600"><span className="font-semibold">Internal hex:</span> <span className="font-mono">{materialHex(value, expectedBytes ?? 16)}</span></div>}
                    {issue && <span className="mt-1 block text-xs font-semibold text-amber-700">{issue.message}</span>}
                  </Field>
                );
              })}
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm font-medium">Encoding selector<select className="field mt-1" value={encoding} onChange={(event) => setEncoding(event.target.value)}><option>UTF-8</option><option>Hex</option><option>Binary</option><option>Base64</option></select></label>
                <label className="text-sm font-medium">Output format<select className="field mt-1" value={format} onChange={(event) => setFormat(event.target.value)}><option>Text</option><option>Hex</option><option>Base64</option><option>Binary</option></select></label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary" onClick={() => setValues(Object.fromEntries(inputs.map((input) => [input, sampleFor(input)])))}><Sparkles className="h-4 w-4" /> Sample</button>
                <button className="btn" onClick={() => setValues((current) => Object.fromEntries(inputs.map((input) => [input, /key|iv|nonce|salt|block|seed|scalar/i.test(input) ? randomAscii(16) : current[input] || sampleFor(input)])))}><Shuffle className="h-4 w-4" /> Random fields</button>
                <button className="btn" onClick={resetValues}><RotateCcw className="h-4 w-4" /> Reset</button>
              </div>
              <div className={`rounded-md border p-3 text-sm ${validation.length ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                <div className="flex items-center gap-2 font-semibold">{validation.length ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{validation.length ? `${validation.length} validation issue${validation.length === 1 ? "" : "s"}` : "Inputs look ready"}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone="info">ASCII input</StatusPill>
                <StatusPill tone={validation.length ? "warning" : "success"}>{validation.length ? "Needs attention" : "Ready"}</StatusPill>
                <StatusPill tone={status === "Modern" ? "success" : status === "Unsafe" ? "error" : "warning"}>{status === "Unsafe" ? "Unsafe if misused" : status}</StatusPill>
              </div>
            </div>
          </InputPanel>
          <OutputPanel>
            <div className="space-y-3">
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                Computed locally in the browser. Legacy or browser-unavailable primitives use small educational arithmetic or Web Crypto-backed previews instead of empty placeholders.
              </div>
              {derived.map((output) => <div key={output.output} className="rounded-md border border-teal-100 bg-teal-50/60 p-3"><div className="flex items-center justify-between gap-3"><div className="text-xs font-semibold uppercase text-teal-800">{output.output}</div><CopyButton value={output.value} label="Copy" /></div><div className="mt-2 break-all rounded border border-teal-100 bg-white p-2 font-mono text-sm text-slate-900">{output.value}</div></div>)}
              <CopyButton value={allOutputText} label="Copy all outputs" />
            </div>
          </OutputPanel>
        </section>
      )}

      {activeTab === "Step-by-Step" && (
        <section id="step-by-step" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Step-by-step visualization and internal state</h2>
          <StepControls step={step} max={Math.max(visualizers.length - 1, 0)} onStep={setStep} />
          <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">Current step: <span className="font-semibold">{activeStepName}</span></div>
          <div className="mt-4">
            <ByteLevelFlowDiagram input={firstInput} output={firstOutput} operation={title} activeStep={step} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visualizers.map((item, index) => <div key={item} className={`rounded-md border p-4 ${index === step ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"}`}><div className="font-semibold">{item}</div><div className="mt-3 grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, bit) => <span key={bit} className={`h-3 rounded ${bit <= (index + combined.length) % 8 ? "bg-teal-500" : "bg-slate-200"} ${index === step && bit === step % 8 ? "changed-byte" : ""}`} />)}</div></div>)}</div>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><h3 className="mb-3 font-semibold">Plaintext / input</h3><pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-3 font-mono text-xs">{firstInput}</pre></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><h3 className="mb-3 font-semibold">Ciphertext / output</h3><pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all rounded bg-white p-3 font-mono text-xs">{firstOutput}</pre></div>
          </div>
          <div className="mt-5 rounded-md border border-slate-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">Visual diff highlight</h3>
            <div className="flex flex-wrap gap-1 font-mono text-xs">{diffCharacters(firstInput, firstOutput).map((char) => <span key={char.index} className={`min-w-6 rounded px-1 py-1 text-center ${char.changed ? "bg-amber-100 text-amber-900 changed-byte" : "bg-slate-100 text-slate-600"}`}>{char.after || "·"}</span>)}</div>
          </div>
        </section>
      )}

      {activeTab === "Security Notes" && (
        <section id="security-notes" className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Learning notes</h2>
            <div className="space-y-3">
              {[["formula", "Formula and structure", notes.join(" ")], ["parameters", "Parameter guidance", status === "Modern" ? "Prefer authenticated modes, unique nonces, strong keys, and vetted implementations." : "Treat this page as a learning tool and migrate away from weak or deprecated primitives."], ["validation", "Validation rules", "Inputs are checked for missing values, non-ASCII key material, short salts or nonces, and numeric parameter mistakes."]].map(([id, label, text]) => (
                <div key={id} className="rounded-md border border-slate-200">
                  <button className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold" onClick={() => setExpanded(expanded === id ? null : id)}>{label}<ChevronDown className={`h-4 w-4 transition ${expanded === id ? "" : "-rotate-90"}`} /></button>
                  {expanded === id && <p className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">{text}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Common mistakes</h2>
            <WarningBadge>{status === "Modern" ? "Correct parameters and authenticated usage still matter." : "This page is educational; do not use weak or deprecated primitives for new systems."}</WarningBadge>
            <div className="mt-4 grid gap-3">{commonMistakes.map((mistake) => <div key={mistake} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">{mistake}</div>)}</div>
          </div>
        </section>
      )}

      {activeTab === "Test Vectors" && (
        <section id="test-vectors" className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Test vectors and export</h2>
          <p className="text-sm text-slate-600">Use sample values as a repeatable local test vector, then export JSON, a text report, or a print-ready page.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {derived.map((output) => <div key={output.output} className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">{output.output}</div><div className="mt-1 break-all font-mono text-sm">{output.value}</div></div>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2"><ExportReportButton title={title} data={report} /><button className="btn" onClick={() => navigator.clipboard?.writeText(textReport({ title, category, status, values, derived, notes }))}><FileText className="h-4 w-4" /> Copy text report</button><button className="btn" onClick={() => window.print()}>Print summary</button><button className="btn" onClick={async () => { await saveExperiment({ id: crypto.randomUUID(), algorithm: title, title: `${title} experiment`, createdAt: new Date().toISOString(), input: values, output: derived, steps: visualizers }); setSaved("Saved to IndexedDB"); }}>Save experiment</button></div>{saved && <p className="mt-3 text-sm font-semibold text-emerald-700">{saved}</p>}
        </section>
      )}
    </div>
  );
}
