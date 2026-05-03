import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { bytesToHex, parseHexStrict } from "../../../lib/codecs";
import { explainCryptoError } from "../../../lib/cryptoValidation";
import { testVectors, type TestVector } from "../../../data/testVectors";

interface VectorResult {
  id: string;
  algorithm: string;
  name: string;
  expected: string;
  actual: string;
  pass: boolean;
  source: string;
  error?: string;
}

const encoder = new TextEncoder();
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;

async function runVector(vector: TestVector): Promise<VectorResult> {
  try {
    if (vector.algorithm === "SHA-256") {
      const digest = await crypto.subtle.digest("SHA-256", encoder.encode(String(vector.input.message)));
      const actual = bytesToHex(digest);
      const expected = vector.expected.digestHex;
      return { id: vector.id, algorithm: vector.algorithm, name: vector.name, expected, actual, pass: actual === expected, source: vector.source };
    }
    if (vector.algorithm === "PBKDF2") {
      const baseKey = await crypto.subtle.importKey("raw", encoder.encode(String(vector.input.password)), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({
        name: "PBKDF2",
        salt: encoder.encode(String(vector.input.salt)),
        iterations: Number(vector.input.iterations),
        hash: String(vector.input.hash),
      }, baseKey, Number(vector.input.lengthBits));
      const actual = bytesToHex(bits);
      const expected = vector.expected.derivedHex;
      return { id: vector.id, algorithm: vector.algorithm, name: vector.name, expected, actual, pass: actual === expected, source: vector.source };
    }
    if (vector.algorithm === "AES") {
      const key = parseHexStrict(String(vector.input.key), 16);
      const iv = parseHexStrict(String(vector.input.iv), 16);
      const plaintext = parseHexStrict(String(vector.input.plaintextHex));
      if (!key.ok || !iv.ok || !plaintext.ok) throw new Error([...key.errors, ...iv.errors, ...plaintext.errors].join(" "));
      const cryptoKey = await crypto.subtle.importKey("raw", toArrayBuffer(key.bytes), "AES-CBC", false, ["encrypt"]);
      const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: new Uint8Array(toArrayBuffer(iv.bytes)) }, cryptoKey, toArrayBuffer(plaintext.bytes));
      const actual = bytesToHex(encrypted);
      const expected = vector.expected.ciphertextHex;
      return { id: vector.id, algorithm: vector.algorithm, name: vector.name, expected, actual, pass: actual === expected, source: vector.source };
    }
    throw new Error(`${vector.algorithm} is not wired into the global runner yet.`);
  } catch (error) {
    return {
      id: vector.id,
      algorithm: vector.algorithm,
      name: vector.name,
      expected: Object.values(vector.expected).join(", "),
      actual: "",
      pass: false,
      source: vector.source,
      error: explainCryptoError(error),
    };
  }
}

export default function TestVectorRunnerPage() {
  const [results, setResults] = useState<VectorResult[]>([]);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState("All");
  const algorithms = useMemo(() => ["All", ...Array.from(new Set(testVectors.map((vector) => vector.algorithm))).sort()], []);
  const visibleVectors = useMemo(() => testVectors.filter((vector) => filter === "All" || vector.algorithm === filter), [filter]);
  const visibleResults = useMemo(() => results.filter((result) => filter === "All" || result.algorithm === filter), [filter, results]);
  const passed = visibleResults.filter((result) => result.pass).length;

  const runVisible = async () => {
    setRunning(true);
    const next = await Promise.all(visibleVectors.map(runVector));
    setResults((current) => [...current.filter((result) => !visibleVectors.some((vector) => vector.id === result.id)), ...next]);
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Global Test Vector Runner" category="Benchmark and Comparison" status="Educational">Run known-answer checks locally against Web Crypto and custom browser logic so pages can be audited with repeatable vectors.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Vector controls">
          <div className="space-y-4">
            <label className="label">Algorithm family<select className="field mt-1" value={filter} onChange={(event) => setFilter(event.target.value)}>{algorithms.map((algorithm) => <option key={algorithm}>{algorithm}</option>)}</select></label>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={runVisible} disabled={running}>{running ? "Running..." : "Run visible vectors"}</button><button className="btn" onClick={() => setResults([])}>Clear results</button></div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-2xl font-bold">{visibleVectors.length}</div><div className="text-sm text-slate-600">registered vectors</div></div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3"><div className="text-2xl font-bold text-emerald-900">{passed}</div><div className="text-sm text-emerald-800">passed</div></div>
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3"><div className="text-2xl font-bold text-rose-900">{Math.max(visibleResults.length - passed, 0)}</div><div className="text-sm text-rose-800">failed</div></div>
            </div>
            <WarningBadge>Known-answer tests prove this browser produced the expected bytes for these fixtures. They do not replace a formal cryptographic review.</WarningBadge>
          </div>
        </Card>
        <Card title="Registered vectors">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Algorithm</th><th className="p-2 text-left">Vector</th><th className="p-2 text-left">Expected</th><th className="p-2 text-left">Source</th></tr></thead>
              <tbody>{visibleVectors.map((vector) => <tr key={vector.id} className="border-t border-slate-100"><td className="p-2 font-semibold">{vector.algorithm}</td><td className="p-2">{vector.name}</td><td className="break-all p-2 font-mono text-xs">{Object.values(vector.expected).join(", ")}</td><td className="p-2 text-slate-600">{vector.source}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <Card title="Run results">
        {visibleResults.length ? (
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Status</th><th className="p-2 text-left">Algorithm</th><th className="p-2 text-left">Vector</th><th className="p-2 text-left">Actual</th><th className="p-2 text-left">Expected</th></tr></thead>
              <tbody>
                {visibleResults.map((result) => (
                  <tr key={result.id} className="border-t border-slate-100">
                    <td className={`p-2 font-semibold ${result.pass ? "text-emerald-700" : "text-rose-700"}`}>{result.pass ? "PASS" : "FAIL"}</td>
                    <td className="p-2">{result.algorithm}</td>
                    <td className="p-2">{result.name}{result.error ? <div className="mt-1 text-xs text-rose-700">{result.error}</div> : null}</td>
                    <td className="break-all p-2 font-mono text-xs">{result.actual || "-"}</td>
                    <td className="break-all p-2 font-mono text-xs">{result.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Run vectors to see pass/fail output from this browser.</div>
        )}
      </Card>
    </div>
  );
}
