import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { rc5DecryptBlock, rc5EncryptBlock } from "../../../lib/legacyCiphers";
import { asciiToHex } from "../../../lib/format";

const wordHex = (value: number) => value.toString(16).padStart(8, "0");
const wordBits = (value: number) => value.toString(2).padStart(32, "0");
const rotatePreview = (value: number, amount: number) => {
  const bits = wordBits(value);
  const shift = amount & 31;
  return shift === 0 ? bits : bits.slice(shift) + bits.slice(0, shift);
};
const splitBits = (bits: string, amount: number) => {
  const shift = amount & 31;
  return shift === 0 ? { moving: "", remaining: bits } : { moving: bits.slice(0, shift), remaining: bits.slice(shift) };
};

export default function RC5Page() {
  const [block, setBlock] = useState("RC5 data");
  const [key, setKey] = useState("RC5 demo key 123");
  const [rounds, setRounds] = useState(12);
  const [operation, setOperation] = useState<"encrypt" | "decrypt">("encrypt");
  const [activeTrace, setActiveTrace] = useState(1);
  const result = useMemo(() => operation === "encrypt" ? rc5EncryptBlock(asciiToHex(block, 8), asciiToHex(key, 16), rounds) : rc5DecryptBlock(asciiToHex(block, 8), asciiToHex(key, 16), rounds), [block, key, operation, rounds]);
  const activeRow = result.trace[Math.min(activeTrace, result.trace.length - 1)] ?? result.trace[0];
  const aBits = wordBits(activeRow?.a ?? 0);
  const aSplit = splitBits(aBits, activeRow?.rotationA ?? 0);

  return (
    <div className="space-y-6">
      <PageHeader title="RC5 ARX Workbench" category="Symmetric Cryptography" status="Legacy">Run real RC5-32 block encryption with add-rotate-XOR rounds and inspect data-dependent rotation amounts.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="RC5 parameters">
          <div className="grid gap-4">
            <Field label="64-bit block ASCII" value={block} expectedBytes={8} hint="Converted internally to two 32-bit RC5 words."><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
            <Field label="Key ASCII" value={key} expectedBytes={16} hint="Converted internally to the RC5 key schedule input."><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Rounds"><input className="field" type="number" min={1} max={24} value={rounds} onChange={(event) => setRounds(Number(event.target.value))} /></Field>
              <Field label="Operation"><select className="field" value={operation} onChange={(event) => setOperation(event.target.value as "encrypt" | "decrypt")}><option value="encrypt">Encrypt</option><option value="decrypt">Decrypt</option></select></Field>
            </div>
          </div>
        </Card>
        <Card title="RC5 output and key schedule">
          <div className="space-y-3">
            <ValueRow label="Output block hex" value={result.outputHex} />
            <ValueRow label="S[0]" value={wordHex(result.s[0])} />
            <ValueRow label="S[1]" value={wordHex(result.s[1])} />
            <ValueRow label="Expanded subkeys" value={`${result.s.length} words`} />
          </div>
        </Card>
      </div>
      <Card title="Current ARX operation">
        <div className="grid gap-4 xl:grid-cols-[14rem_1fr]">
          <Field label={`Trace row: ${Math.min(activeTrace + 1, result.trace.length)} of ${result.trace.length}`}>
            <input type="range" min="0" max={Math.max(result.trace.length - 1, 0)} value={Math.min(activeTrace, Math.max(result.trace.length - 1, 0))} onChange={(event) => setActiveTrace(Number(event.target.value))} className="w-full" />
          </Field>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase text-slate-500">Operation now</div>
              <div className="mt-1 font-semibold">{operation === "encrypt" ? "XOR -> Rotation -> Addition" : "Subtraction -> Rotation -> XOR"}</div>
              <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-2 text-xs font-semibold text-blue-900">{operation === "encrypt" ? "Current focus: data-dependent rotate left, then add the subkey." : "Current focus: subtract the subkey, rotate right, then undo XOR."}</div>
            </div>
            <ValueRow label="A rotation amount" value={String(activeRow?.rotationA ?? 0)} />
            <ValueRow label="B rotation amount" value={String(activeRow?.rotationB ?? 0)} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-amber-800">A word rotation preview</div>
            <div className="font-mono text-xs break-all"><span className="rounded bg-amber-200 px-1 font-bold text-amber-950">{aSplit.moving}</span>{aSplit.remaining}</div>
            <div className="my-2 text-center font-semibold">rotate by {activeRow?.rotationA ?? 0}</div>
            <div className="font-mono text-xs break-all">{aSplit.remaining}<span className="changed-byte rounded bg-teal-200 px-1 font-bold text-teal-950">{aSplit.moving}</span></div>
            <p className="mt-2 text-xs text-amber-950">Highlighted left bits wrap around to the right side during rotation.</p>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-amber-800">B word rotation preview</div>
            <div className="font-mono text-xs break-all">{wordBits(activeRow?.b ?? 0)}</div>
            <div className="my-2 text-center font-semibold">rotate by {activeRow?.rotationB ?? 0}</div>
            <div className="font-mono text-xs break-all">{rotatePreview(activeRow?.b ?? 0, activeRow?.rotationB ?? 0)}</div>
          </div>
        </div>
      </Card>
      <Card title="Round trace">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Round</th><th className="p-2 text-left">A word</th><th className="p-2 text-left">B word</th><th className="p-2 text-left">A rotation</th><th className="p-2 text-left">B rotation</th></tr></thead>
            <tbody>
              {result.trace.map((row, index) => <tr key={`${operation}-${row.round}-${row.a}-${row.b}`} className={`border-t border-slate-100 ${index === activeTrace ? "bg-amber-50" : ""}`}><td className="p-2 font-mono">{row.round}</td><td className="p-2 font-mono">{wordHex(row.a)}</td><td className="p-2 font-mono">{wordHex(row.b)}</td><td className="p-2 font-mono">{row.rotationA}</td><td className="p-2 font-mono">{row.rotationB}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Learning notes"><p className="text-sm text-slate-700">RC5 is parameterized. This page uses the common RC5-32 form: two 32-bit words per block, a user-selected round count, and the standard P32/Q32 constants for subkey expansion.</p></Card>
        <Card title="Warnings"><WarningBadge>RC5 is legacy and uncommon in modern protocols. Low round counts are for education only, and new systems should use standardized AEAD ciphers.</WarningBadge></Card>
      </div>
    </div>
  );
}
