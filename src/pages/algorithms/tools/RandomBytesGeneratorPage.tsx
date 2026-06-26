import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const toHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
const toBinary = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(2).padStart(8, "0")).join(" ");
const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

export default function RandomBytesGeneratorPage() {
  const [count, setCount] = useState(32);
  const [format, setFormat] = useState("Hex");
  const [bytes, setBytes] = useState(() => {
    const data = new Uint8Array(32);
    crypto.getRandomValues(data);
    return data;
  });
  const output = useMemo(() => {
    if (format === "Base64") return toBase64(bytes);
    if (format === "Binary") return toBinary(bytes);
    return toHex(bytes);
  }, [bytes, format]);
  const histogram = useMemo(() => {
    const buckets = Array.from({ length: 16 }, () => 0);
    bytes.forEach((byte) => { buckets[byte >> 4] += 1; });
    return buckets;
  }, [bytes]);
  const generate = () => {
    const safeCount = Math.max(1, Math.min(4096, count));
    const data = new Uint8Array(safeCount);
    crypto.getRandomValues(data);
    setBytes(data);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Random Bytes Generator" category="Randomness and Entropy" status="Modern">Generate local cryptographic random bytes with the browser Web Crypto CSPRNG. No server call is made.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Generator controls">
          <div className="grid gap-4">
            <Field label="Byte count"><input className="field font-mono" type="number" min={1} max={4096} value={count} onChange={(event) => setCount(Number(event.target.value))} /></Field>
            <Field label="Output format"><select className="field" value={format} onChange={(event) => setFormat(event.target.value)}><option>Hex</option><option>Base64</option><option>Binary</option></select></Field>
            <button className="btn" onClick={generate}>Generate with Web Crypto</button>
          </div>
        </Card>
        <Card title="Random output">
          <div className="space-y-4">
            <ValueRow label="Length" value={`${bytes.length} bytes / ${bytes.length * 8} bits`} />
            <pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{output}</pre>
            <div className="grid grid-cols-8 gap-2 md:grid-cols-16">{Array.from(bytes.slice(0, 64), (byte, index) => <div key={index} className="rounded bg-slate-100 p-2 text-center font-mono text-xs">{byte.toString(16).padStart(2, "0")}</div>)}</div>
          </div>
        </Card>
      </div>
      <Card title="Distribution by high nibble">
        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">{histogram.map((value, index) => <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="font-mono text-sm">{index.toString(16).toUpperCase()}x</div><div className="mt-2 h-2 rounded bg-slate-200"><div className="h-2 rounded bg-cyan-500" style={{ width: `${Math.min(100, (value / Math.max(1, bytes.length)) * 1600)}%` }} /></div><div className="mt-1 text-xs text-slate-500">{value}</div></div>)}</div>
      </Card>
      <Card title="Where random bytes are used">
        <div className="grid gap-3 md:grid-cols-4">
          {["Encryption keys", "Nonces and IVs", "Salts", "Session tokens"].map((use) => <div key={use} className="rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-950">{use}</div>)}
        </div>
        <p className="mt-3 text-sm text-slate-700">Encryption needs unpredictable values so attackers cannot guess keys, replay nonces, precompute password tables, or forge random-looking tokens.</p>
      </Card>
      <Card title="Randomness graph">
        <div className="flex h-36 items-end gap-1 rounded-md border border-slate-200 bg-slate-50 p-3">
          {Array.from(bytes.slice(0, 64), (byte, index) => <div key={index} className="min-w-1 flex-1 rounded-t bg-cyan-500" style={{ height: `${Math.max(4, (byte / 255) * 100)}%` }} title={`${byte}`} />)}
        </div>
      </Card>
      <Card title="Learning notes and export">
        <WarningBadge>Use generated key material carefully. Anyone who sees these bytes can use them.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="Random bytes" data={{ count, format, output }} /></div>
      </Card>
    </div>
  );
}
