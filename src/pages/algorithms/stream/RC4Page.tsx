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
  const inputBytes = useMemo(() => inputMode === "Hex" ? hexToBytes(plain) : textToBytes(plain), [inputMode, plain]);
  const keyBytes = useMemo(() => textToBytes(key), [key]);
  const result = useMemo(() => rc4(keyBytes, inputBytes), [inputBytes, keyBytes]);
  const roundTrip = useMemo(() => rc4(keyBytes, result.output).output, [keyBytes, result.output]);

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
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="KSA trace, first 16 swaps">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">i</th><th className="p-2 text-left">j</th><th className="p-2 text-left">S[i]</th><th className="p-2 text-left">S[j]</th></tr></thead>
              <tbody>{result.ksaTrace.map((row, index) => <tr key={row.step} className={`border-t border-slate-100 ${activePhase === "KSA" && index === 0 ? "bg-amber-50" : ""}`}><td className="p-2 font-mono">{row.i}</td><td className="p-2 font-mono">{row.j}</td><td className="p-2 font-mono">{row.si}</td><td className="p-2 font-mono">{row.sj}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
        <Card title="PRGA trace">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Byte</th><th className="p-2 text-left">i</th><th className="p-2 text-left">j</th><th className="p-2 text-left">Keystream</th></tr></thead>
              <tbody>{result.prgaTrace.map((row, index) => <tr key={row.step} className={`border-t border-slate-100 ${activePhase === "PRGA" && index === 0 ? "bg-amber-50" : ""}`}><td className="p-2 font-mono">{row.step}</td><td className="p-2 font-mono">{row.i}</td><td className="p-2 font-mono">{row.j}</td><td className="p-2 font-mono">{row.keystream.toString(16).padStart(2, "0")}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      </div>
      <WarningBadge>RC4 is deprecated. Early keystream biases and protocol failures made it unsafe for TLS, WEP, and modern confidentiality.</WarningBadge>
    </div>
  );
}
