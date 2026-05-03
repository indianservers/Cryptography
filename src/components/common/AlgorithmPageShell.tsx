import { useMemo, useState } from "react";
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

const fnv1a = (value: string) => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
};

const randomHex = (bytes: number) => {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export function AlgorithmPageShell({ title, category, status, intro, inputs, outputs, visualizers, notes }: AlgorithmPageShellProps) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(inputs.map((input) => [input, sampleFor(input)])));
  const [encoding, setEncoding] = useState("UTF-8");
  const [format, setFormat] = useState("Hex");
  const [saved, setSaved] = useState("");
  const combined = JSON.stringify({ title, values, encoding, format });
  const derived = useMemo(() => {
    const base = fnv1a(combined);
    return outputs.map((output, index) => ({
      output,
      value: `${base}-${fnv1a(`${output}:${combined}:${index}`)}`,
    }));
  }, [combined, outputs]);
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
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Simulated output — values change with input but are not cryptographically computed. Upgrade this page to a real implementation for accurate results.
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
