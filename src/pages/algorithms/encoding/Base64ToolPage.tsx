import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";

const encodeUtf8 = (value: string) => btoa(String.fromCharCode(...new TextEncoder().encode(value)));
const decodeUtf8 = (value: string) => new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));

export default function Base64ToolPage() {
  const [input, setInput] = useState("Mega Cryptography Suite");
  const [urlSafe, setUrlSafe] = useState(false);
  const [padding, setPadding] = useState(true);
  const encoded = useMemo(() => {
    let value = encodeUtf8(input);
    if (urlSafe) value = value.replace(/\+/g, "-").replace(/\//g, "_");
    if (!padding) value = value.replace(/=+$/, "");
    return value;
  }, [input, padding, urlSafe]);
  const chunks = encoded.match(/.{1,4}/g) ?? [];
  const bytes = Array.from(new TextEncoder().encode(input));
  const bitGroups = bytes.map((byte) => byte.toString(2).padStart(8, "0")).join("").match(/.{1,6}/g) ?? [];
  const decoded = useMemo(() => {
    try {
      let value = encoded.replace(/-/g, "+").replace(/_/g, "/");
      value = value.padEnd(Math.ceil(value.length / 4) * 4, "=");
      return decodeUtf8(value);
    } catch {
      return "Invalid Base64";
    }
  }, [encoded]);

  return (
    <div className="space-y-6">
      <PageHeader title="Base64 Tool" category="Encoding Tools" status="Educational">Encode and decode bytes locally. Base64 changes representation; it does not encrypt or authenticate data.</PageHeader>
      <Card title="Base64 is not encryption">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Base64 only changes bytes into printable text. There is no secret key, and anyone can decode it back to the original data.
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input and options">
          <div className="grid gap-4">
            <Field label="Text input"><textarea className="field min-h-28" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={urlSafe} onChange={(event) => setUrlSafe(event.target.checked)} /> URL-safe alphabet</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={padding} onChange={(event) => setPadding(event.target.checked)} /> Include padding</label>
          </div>
        </Card>
        <Card title="Encoded and decoded output">
          <div className="space-y-3">
            <ValueRow label="Base64" value={encoded} />
            <ValueRow label="Decoded round-trip" value={decoded} />
          </div>
        </Card>
      </div>
      <Card title="24-bit chunk visualization">
        <div className="grid gap-2 md:grid-cols-4">{chunks.map((chunk, index) => <div key={`${chunk}-${index}`} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-center font-mono">{chunk}</div>)}</div>
      </Card>
      <Card title="Text to Base64 step by step">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase text-slate-500">1. UTF-8 bytes</div>
            <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs">{bytes.map((byte, index) => <span key={index} className="rounded bg-white px-2 py-1">{byte.toString(16).padStart(2, "0")}</span>)}</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase text-slate-500">2. Six-bit groups</div>
            <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs">{bitGroups.slice(0, 24).map((bits, index) => <span key={index} className="rounded bg-white px-2 py-1">{bits.padEnd(6, "0")}</span>)}</div>
          </div>
          <div className="rounded-md border border-teal-200 bg-teal-50 p-3 text-teal-950">
            <div className="text-xs font-semibold uppercase">3. Base64 characters</div>
            <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs">{chunks.map((chunk, index) => <span key={index} className="rounded bg-white/80 px-2 py-1">{chunk}</span>)}</div>
          </div>
        </div>
      </Card>
      <WarningBadge>Base64 output may look opaque, but anyone can decode it. Use encryption when confidentiality is required.</WarningBadge>
    </div>
  );
}
