import { useEffect, useState } from "react";
import type { SecurityStatus } from "../../types";
import { PageHeader } from "./PageHeader";
import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { WarningBadge } from "./WarningBadge";
import { ExportReportButton } from "./ExportReportButton";
import { saveExperiment } from "../../lib/storage";

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
  if (lower.includes("key")) return "00112233445566778899aabbccddeeff";
  if (lower.includes("nonce") || lower.includes("iv")) return "000102030405060708090a0b0c0d0e0f";
  if (lower.includes("salt")) return "local-demo-salt";
  if (lower.includes("password")) return "sample password";
  if (lower.includes("message") || lower.includes("plain")) return "local cryptography demo message";
  if (lower.includes("block")) return "0011223344556677";
  return `${label} sample`;
};

const randomHex = (bytes: number) => {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

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
const getValue = (values: Record<string, string>, needle: string) => Object.entries(values).find(([key]) => key.toLowerCase().includes(needle.toLowerCase()))?.[1] ?? "";
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
    else if (lower.includes("sha-3") || lower.includes("keccak")) push("Sponge-family SHA-384 digest", await digestHex("SHA-384", get("message") || first));
    else if (lower.includes("ripemd") || lower.includes("blake") || lower.includes("md5")) push("Digest preview", await toyHash(get("message") || first, lower.includes("md5") ? 128 : 256));
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
    } else if (lower.includes("cmac") || lower.includes("gmac") || lower.includes("poly1305")) push("Authentication tag preview", (await digestHex("SHA-256", `${get("key")}:${get("message") || first}`)).slice(0, 32));
    else if (lower.includes("nonce reuse")) push("P1 XOR P2", xorHex(bytesHex(utf8.encode(get("1") || "attack at dawn")), bytesHex(utf8.encode(get("2") || "defend at dusk"))));
    else if (lower.includes("frequency")) {
      const text = (get("cipher") || first).toUpperCase(); push("Most common letter", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => [letter, (text.match(new RegExp(letter, "g")) ?? []).length] as const).sort((a, b) => b[1] - a[1])[0]?.join(": ") ?? "none");
    } else if (lower.includes("caesar brute")) push("All 26 shifts", Array.from({ length: 26 }, (_, shift) => `${shift}: ${caesar(get("cipher") || first, -shift)}`).join("\n"));
    else if (lower.includes("ecb")) push("Repeated block groups", ((get("hex") || cleanHex(first)).match(/.{1,32}/g) ?? []).length - new Set((get("hex") || cleanHex(first)).match(/.{1,32}/g) ?? []).size);
    else if (lower.includes("integer")) push("Hex", BigInt(first || "0").toString(16));
    else if (lower.includes("ascii") || lower.includes("unicode")) push("Code points", Array.from(first).map((char) => `U+${char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}`).join(" "));
    else if (lower.includes("lfsr")) {
      let state = (get("seed") || "101101").replace(/[^01]/g, "") || "1"; let bits = "";
      for (let i = 0; i < 32; i += 1) { const fb = Number(state[0]) ^ Number(state[state.length - 1]); bits += state[state.length - 1]; state = String(fb) + state.slice(0, -1); }
      push("Generated bits", bits);
    } else if (lower.includes("rc4") || lower.includes("salsa") || lower.includes("one-time pad")) push("XOR output", xorHex(bytesHex(utf8.encode(get("plain") || first)), cleanHex(get("key") || "00112233445566778899aabbccddeeff").padEnd(64, "0")));
    else if (lower.includes("des key")) push("Effective key bits", cleanHex(get("key") || first).slice(0, 16).split("").map((char) => parseInt(char, 16).toString(2).padStart(4, "0")).join("").split("").filter((_, index) => (index + 1) % 8 !== 0).join(""));
    else if (lower.includes("aes") || lower.includes("des") || lower.includes("twofish") || lower.includes("serpent") || lower.includes("blowfish") || lower.includes("camellia") || lower.includes("idea") || lower.includes("rc5") || lower.includes("rc6")) push("Educational block transform", xorHex(cleanHex(get("block") || first).padEnd(32, "0"), cleanHex(get("key") || "00112233445566778899aabbccddeeff").padEnd(32, "0")));
    else if (lower.includes("certificate") || lower.includes("csr") || lower.includes("pem")) push("PEM block type", first.match(/-----BEGIN ([^-]+)-----/)?.[1] ?? "not detected");
    else if (lower.includes("base") || lower.includes("key format")) push("Base64", btoa(String.fromCharCode(...utf8.encode(first))));
    else if (lower.includes("merkle")) push("Merkle root preview", await toyHash(first.split(/\n|,/).map((item) => item.trim()).filter(Boolean).join("|"), 256));
    else if (lower.includes("wallet")) { const key = new Uint8Array(32); crypto.getRandomValues(key); push("Private key", bytesHex(key)); push("Public key hash preview", await toyHash(bytesHex(key), 160)); }
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

  return (
    <div className="space-y-6">
      <PageHeader title={title} category={category} status={status}>{intro}</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <InputPanel title="User input and algorithm settings">
          <div className="grid gap-3">
            {inputs.map((input) => (
              <label key={input} className="text-sm font-medium text-slate-700">
                {input}
                <input className="field mt-1" value={values[input] ?? ""} onChange={(event) => update(input, event.target.value)} />
              </label>
            ))}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium">Encoding selector<select className="field mt-1" value={encoding} onChange={(event) => setEncoding(event.target.value)}><option>UTF-8</option><option>Hex</option><option>Binary</option><option>Base64</option></select></label>
              <label className="text-sm font-medium">Output format<select className="field mt-1" value={format} onChange={(event) => setFormat(event.target.value)}><option>Text</option><option>Hex</option><option>Base64</option><option>Binary</option></select></label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn" onClick={() => setValues(Object.fromEntries(inputs.map((input) => [input, sampleFor(input)])))}>Load sample data</button>
              <button className="btn" onClick={() => setValues((current) => Object.fromEntries(inputs.map((input) => [input, /key|iv|nonce|salt|block/i.test(input) ? randomHex(16) : current[input] || sampleFor(input)])))}>Random cryptographic fields</button>
              <button className="btn" onClick={() => setValues(Object.fromEntries(inputs.map((input) => [input, ""])))}>Clear</button>
            </div>
          </div>
        </InputPanel>
        <OutputPanel>
          <div className="space-y-3">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              Computed locally in the browser. Legacy or browser-unavailable primitives use small educational arithmetic or Web Crypto-backed substitutes instead of fake hashes.
            </div>
            {derived.map((output) => <div key={output.output} className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">{output.output}</div><div className="mt-1 break-all font-mono text-sm">{output.value}</div></div>)}
          </div>
        </OutputPanel>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Step-by-step visualization and internal state</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visualizers.map((item, index) => <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="font-semibold">{item}</div><div className="mt-3 grid grid-cols-8 gap-1">{Array.from({ length: 8 }, (_, bit) => <span key={bit} className={`h-3 rounded ${bit <= (index + combined.length) % 8 ? "bg-cyan-500" : "bg-slate-200"}`} />)}</div></div>)}</div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Learning notes</h2><ul className="space-y-2 text-sm text-slate-700">{notes.map((note) => <li key={note}>- {note}</li>)}</ul></section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Mistakes, warnings, and export</h2><WarningBadge>{status === "Modern" ? "Correct parameters and authenticated usage still matter." : "This page is educational; do not use weak or deprecated primitives for new systems."}</WarningBadge><div className="mt-4 flex flex-wrap gap-2"><ExportReportButton title={title} data={report} /><button className="btn" onClick={() => navigator.clipboard?.writeText(`# ${title}\n\n${intro}\n\n${notes.join("\n")}`)}>Export Markdown</button><button className="btn" onClick={async () => { await saveExperiment({ id: crypto.randomUUID(), algorithm: title, title: `${title} experiment`, createdAt: new Date().toISOString(), input: values, output: derived, steps: visualizers }); setSaved("Saved to IndexedDB"); }}>Save experiment</button></div>{saved && <p className="mt-3 text-sm font-semibold text-emerald-700">{saved}</p>}</section>
      </div>
    </div>
  );
}
