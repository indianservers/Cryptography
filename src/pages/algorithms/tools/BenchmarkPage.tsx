import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const toHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;

async function digest(name: string, data: Uint8Array) {
  const result = await crypto.subtle.digest(name, toArrayBuffer(data));
  return new Uint8Array(result);
}

async function aesGcm(data: Uint8Array) {
  const keyBytes = new Uint8Array(32);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(keyBytes);
  crypto.getRandomValues(iv);
  const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt"]);
  return new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, toArrayBuffer(data)));
}

async function hmacSha256(data: Uint8Array) {
  const keyBytes = new Uint8Array(32);
  crypto.getRandomValues(keyBytes);
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, toArrayBuffer(data)));
}

export default function BenchmarkPage() {
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [size, setSize] = useState(1024 * 64);
  const [iterations, setIterations] = useState(20);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ms: number; throughput: number; output: string } | null>(null);
  const inputSizeLabel = useMemo(() => `${(size / 1024).toFixed(0)} KiB`, [size]);
  const average = algorithm === "AES-GCM" ? 450 : algorithm === "HMAC-SHA-256" ? 300 : algorithm === "SHA-512" ? 380 : 500;
  const comparison = result ? result.throughput >= average ? "above the classroom average" : "below the classroom average" : "run a benchmark to compare";

  const run = async () => {
    setRunning(true);
    const data = new Uint8Array(size);
    crypto.getRandomValues(data);
    const start = performance.now();
    let output = new Uint8Array();
    for (let index = 0; index < iterations; index += 1) {
      if (algorithm === "AES-GCM") output = await aesGcm(data);
      else if (algorithm === "HMAC-SHA-256") output = await hmacSha256(data);
      else output = await digest(algorithm, data);
    }
    const ms = performance.now() - start;
    const mb = (size * iterations) / (1024 * 1024);
    setResult({ ms, throughput: mb / (ms / 1000), output: toHex(output.slice(0, 32)) });
    setRunning(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Browser Benchmark" category="Benchmark and Comparison" status="Educational">Run local Web Crypto timing tests. Results vary by browser, hardware, power mode, and tab state.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Benchmark settings">
          <div className="grid gap-4">
            <Field label="Algorithm"><select className="field" value={algorithm} onChange={(event) => setAlgorithm(event.target.value)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option><option>AES-GCM</option><option>HMAC-SHA-256</option></select></Field>
            <Field label="Input size"><select className="field" value={size} onChange={(event) => setSize(Number(event.target.value))}><option value={4096}>4 KiB</option><option value={65536}>64 KiB</option><option value={1048576}>1 MiB</option><option value={4194304}>4 MiB</option></select></Field>
            <Field label="Iterations"><input className="field font-mono" type="number" min={1} max={200} value={iterations} onChange={(event) => setIterations(Number(event.target.value))} /></Field>
            <button className="btn" onClick={run} disabled={running}>{running ? "Running..." : "Run local benchmark"}</button>
          </div>
        </Card>
        <Card title="Timing result">
          {result ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <ValueRow label="Input per iteration" value={inputSizeLabel} />
                <ValueRow label="Time taken" value={`${result.ms.toFixed(2)} ms`} />
                <ValueRow label="Throughput" value={`${result.throughput.toFixed(2)} MiB/s`} />
                <ValueRow label="Average reference" value={`${average} MiB/s`} />
                <ValueRow label="Comparison" value={comparison} />
              </div>
              <div className="h-4 rounded bg-slate-200"><div className="h-4 rounded bg-cyan-500" style={{ width: `${Math.min(100, result.throughput / 20)}%` }} /></div>
              <ValueRow label="Output preview" value={result.output} />
            </div>
          ) : <p className="text-sm text-slate-600">Run the benchmark to measure this browser.</p>}
        </Card>
      </div>
      <Card title="Warnings and export">
        <WarningBadge>Browser benchmarks are useful for comparison on this device only. Scores vary by CPU, browser, battery mode, background tabs, and thermal state.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="Browser benchmark" data={{ algorithm, size, iterations, result }} /></div>
      </Card>
    </div>
  );
}
