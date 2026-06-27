import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { bytesToHex } from "../../../lib/format";

const utf8Bytes = (value: string) => Array.from(new TextEncoder().encode(value));

export default function ASCIIUnicodePage() {
  const [text, setText] = useState("A a नमस्ते 😀");
  const chars = Array.from(text);
  const [active, setActive] = useState(0);
  const selected = chars[Math.min(active, Math.max(chars.length - 1, 0))] ?? "";
  const selectedBytes = useMemo(() => utf8Bytes(selected), [selected]);
  const selectedCode = selected ? selected.codePointAt(0) ?? 0 : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="ASCII and Unicode" category="Encoding Tools" status="Educational">See the selected character as decimal, hex, binary, and UTF-8 bytes at the same time.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Text input">
          <Field label="Text"><textarea className="field min-h-24" value={text} onChange={(event) => { setText(event.target.value); setActive(0); }} /></Field>
          <label className="mt-3 block text-sm font-medium text-slate-700">Selected character: {Math.min(active, Math.max(chars.length - 1, 0))}<input className="ml-3 w-48 align-middle" type="range" min="0" max={Math.max(chars.length - 1, 0)} value={Math.min(active, Math.max(chars.length - 1, 0))} onChange={(event) => setActive(Number(event.target.value))} /></label>
        </Card>
        <Card title="Selected character">
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Character" value={selected || "empty"} />
            <ValueRow label="Decimal code point" value={selected ? selectedCode.toString(10) : "empty"} />
            <ValueRow label="Hex code point" value={selected ? `U+${selectedCode.toString(16).toUpperCase().padStart(4, "0")}` : "empty"} />
            <ValueRow label="Binary code point" value={selected ? selectedCode.toString(2) : "empty"} />
            <ValueRow label="UTF-8 bytes" value={selectedBytes.length ? bytesToHex(selectedBytes) : "empty"} />
            <ValueRow label="Byte count" value={`${selectedBytes.length} byte${selectedBytes.length === 1 ? "" : "s"}`} />
          </div>
        </Card>
      </div>
      <Card title="Character table">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Char</th><th className="p-2 text-left">Decimal</th><th className="p-2 text-left">Hex</th><th className="p-2 text-left">Binary</th><th className="p-2 text-left">UTF-8 bytes</th></tr></thead><tbody>{chars.map((char, index) => {
            const code = char.codePointAt(0) ?? 0;
            const bytes = utf8Bytes(char);
            return <tr key={`${char}-${index}`} className={`border-t border-slate-100 ${index === Math.min(active, Math.max(chars.length - 1, 0)) ? "bg-cyan-50 font-semibold" : ""}`}><td className="p-2">{char === " " ? "[space]" : char}</td><td className="p-2 font-mono">{code}</td><td className="p-2 font-mono">U+{code.toString(16).toUpperCase().padStart(4, "0")}</td><td className="p-2 font-mono">{code.toString(2)}</td><td className="p-2 font-mono">{bytesToHex(bytes)}</td></tr>;
          })}</tbody></table>
        </div>
      </Card>
      <Card title="Why some characters use more bytes">
        <div className="grid gap-3 md:grid-cols-3">
          {[["A", "ASCII letters usually fit in 1 UTF-8 byte."], ["न", "Many language characters need 3 UTF-8 bytes."], ["😀", "Emoji commonly need 4 UTF-8 bytes."]].map(([char, note]) => <div key={char} className="rounded-md border border-slate-200 bg-slate-50 p-3"><p className="text-2xl">{char}</p><p className="mt-2 text-sm text-slate-600">{note}</p></div>)}
        </div>
      </Card>
      <WarningBadge>Cryptography works on bytes, so both sides must agree on the exact text encoding before hashing or encrypting text.</WarningBadge>
    </div>
  );
}
