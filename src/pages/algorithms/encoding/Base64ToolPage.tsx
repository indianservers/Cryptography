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
      <WarningBadge>Base64 output may look opaque, but anyone can decode it. Use encryption when confidentiality is required.</WarningBadge>
    </div>
  );
}
