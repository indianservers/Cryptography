import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ByteGrid } from "../../../components/common/ByteGrid";
import { bytesToHex, bytesToText, hexToBytes, rc4, textToBytes } from "../../../lib/legacyCiphers";

export default function RC4Page() {
  const [key, setKey] = useState("Key");
  const [plain, setPlain] = useState("Plaintext");
  const [inputMode, setInputMode] = useState<"Text" | "Hex">("Text");
  const [activePhase, setActivePhase] = useState<"KSA" | "PRGA">("KSA");
  const [activeKsaRow, setActiveKsaRow] = useState(0);
  const [activePrgaRow, setActivePrgaRow] = useState(0);
  const inputBytes = useMemo(() => inputMode === "Hex" ? hexToBytes(plain) : textToBytes(plain), [inputMode, plain]);
  const keyBytes = useMemo(() => textToBytes(key), [key]);
  const result = useMemo(() => rc4(keyBytes, inputBytes), [inputBytes, keyBytes]);
  const roundTrip = useMemo(() => rc4(keyBytes, result.output).output, [keyBytes, result.output]);
  const ksaRow = result.ksaTrace[Math.min(activeKsaRow, Math.max(result.ksaTrace.length - 1, 0))];
  const prgaRow = result.prgaTrace[Math.min(activePrgaRow, Math.max(result.prgaTrace.length - 1, 0))];

  return (
    <div className="space-y-6">
      <PageHeader title="RC4 KSA and PRGA" category="Stream Ciphers" status="Deprecated">Run real RC4 locally: key scheduling shuffles the 256-byte S array, PRGA emits a keystream, and plaintext is XORed byte-for-byte.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="RC4 inputs">
          <div className="grid gap-4">
            <Field label="Key"><input className="field" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <Field label="Input mode"><select className="field" value={inputMode} onChange={(event) => setInputMode(event.target.value as "Text" | "Hex")}><option>Text</option><option>Hex</option></select></Field>
            <Field label={inputMode === "Hex" ? "Input hex" : "Plaintext"}><textarea className="field min-h-24 font-mono" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="RC4 output">
          <div className="space-y-3">
            <ValueRow label="Keystream hex" value={bytesToHex(result.keystream)} />
            <ValueRow label="Ciphertext hex" value={bytesToHex(result.output)} />
            <ValueRow label="Decrypt ciphertext with same stream" value={inputMode === "Text" ? bytesToText(roundTrip) : bytesToHex(roundTrip)} />
            <div><h3 className="mb-2 text-sm font-semibold">First keystream bytes</h3><ByteGrid bytes={Array.from(result.keystream.slice(0, 16), (byte) => byte.toString(16).padStart(2, "0"))} changed={[0, 1, 2, 3]} /></div>
          </div>
        </Card>
      </div>
      <Card title="KSA / PRGA separator">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
          <button type="button" onClick={() => setActivePhase("KSA")} className={`rounded-md border p-4 text-left ${activePhase === "KSA" ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
            <div className="text-xs font-semibold uppercase">First part</div>
            <div className="mt-1 font-semibold">KSA: key scheduling</div>
            <p className="mt-1 text-sm">The key shuffles the S array before any output bytes are emitted.</p>
          </button>
          <div className="hidden items-center px-2 text-2xl font-semibold text-slate-400 md:flex">{"->"}</div>
          <button type="button" onClick={() => setActivePhase("PRGA")} className={`rounded-md border p-4 text-left ${activePhase === "PRGA" ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
            <div className="text-xs font-semibold uppercase">Second part</div>
            <div className="mt-1 font-semibold">PRGA: keystream bytes</div>
            <p className="mt-1 text-sm">The shuffled S array produces one keystream byte per input byte.</p>
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className={`rounded-md border p-3 ${activePhase === "KSA" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <div className="text-xs font-bold uppercase tracking-wide">KSA changing values</div>
            <p className="mt-1 text-sm">i moves forward, j changes from key bytes, then S[i] and S[j] swap.</p>
          </div>
          <div className={`rounded-md border p-3 ${activePhase === "PRGA" ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            <div className="text-xs font-bold uppercase tracking-wide">PRGA changing values</div>
            <p className="mt-1 text-sm">i and j keep moving; the selected S values produce the next keystream byte.</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="KSA trace, first 16 swaps">
          <Field label={`Highlighted KSA swap: ${Math.min(activeKsaRow + 1, Math.max(result.ksaTrace.length, 1))} of ${Math.max(result.ksaTrace.length, 1)}`}>
            <input className="w-full" type="range" min="0" max={Math.max(result.ksaTrace.length - 1, 0)} value={Math.min(activeKsaRow, Math.max(result.ksaTrace.length - 1, 0))} onChange={(event) => { setActivePhase("KSA"); setActiveKsaRow(Number(event.target.value)); }} />
          </Field>
          {ksaRow && <div className="mb-3 mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Now changing: i=<span className="font-mono font-bold">{ksaRow.i}</span>, j=<span className="font-mono font-bold">{ksaRow.j}</span>, swap S[i]=<span className="font-mono font-bold">{ksaRow.si}</span> with S[j]=<span className="font-mono font-bold">{ksaRow.sj}</span>.</div>}
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">i</th><th className="p-2 text-left">j</th><th className="p-2 text-left">S[i]</th><th className="p-2 text-left">S[j]</th></tr></thead>
              <tbody>{result.ksaTrace.map((row, index) => {
                const active = activePhase === "KSA" && index === activeKsaRow;
                return <tr key={row.step} className={`border-t border-slate-100 ${active ? "bg-amber-50 ring-2 ring-inset ring-amber-300" : ""}`}><td className={`p-2 font-mono ${active ? "font-bold text-amber-950" : ""}`}>{row.i}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.j}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.si}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.sj}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </Card>
        <Card title="PRGA trace">
          <Field label={`Highlighted PRGA byte: ${Math.min(activePrgaRow + 1, Math.max(result.prgaTrace.length, 1))} of ${Math.max(result.prgaTrace.length, 1)}`}>
            <input className="w-full" type="range" min="0" max={Math.max(result.prgaTrace.length - 1, 0)} value={Math.min(activePrgaRow, Math.max(result.prgaTrace.length - 1, 0))} onChange={(event) => { setActivePhase("PRGA"); setActivePrgaRow(Number(event.target.value)); }} />
          </Field>
          {prgaRow && <div className="mb-3 mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Now changing: byte <span className="font-mono font-bold">{prgaRow.step}</span> emits keystream <span className="font-mono font-bold">{prgaRow.keystream.toString(16).padStart(2, "0")}</span>.</div>}
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Byte</th><th className="p-2 text-left">i</th><th className="p-2 text-left">j</th><th className="p-2 text-left">Keystream</th></tr></thead>
              <tbody>{result.prgaTrace.map((row, index) => {
                const active = activePhase === "PRGA" && index === activePrgaRow;
                return <tr key={row.step} className={`border-t border-slate-100 ${active ? "bg-amber-50 ring-2 ring-inset ring-amber-300" : ""}`}><td className="p-2 font-mono">{row.step}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.i}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.j}</td><td className={`p-2 font-mono ${active ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.keystream.toString(16).padStart(2, "0")}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <WarningBadge>RC4 is deprecated. Early keystream biases and protocol failures made it unsafe for TLS, WEP, and modern confidentiality.</WarningBadge>
    </div>
  );
}
