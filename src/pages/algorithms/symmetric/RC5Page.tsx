import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { rc5DecryptBlock, rc5EncryptBlock } from "../../../lib/legacyCiphers";

const wordHex = (value: number) => value.toString(16).padStart(8, "0");

export default function RC5Page() {
  const [block, setBlock] = useState("0001020304050607");
  const [key, setKey] = useState("000102030405060708090a0b0c0d0e0f");
  const [rounds, setRounds] = useState(12);
  const [operation, setOperation] = useState<"encrypt" | "decrypt">("encrypt");
  const result = useMemo(() => operation === "encrypt" ? rc5EncryptBlock(block, key, rounds) : rc5DecryptBlock(block, key, rounds), [block, key, operation, rounds]);

  return (
    <div className="space-y-6">
      <PageHeader title="RC5 ARX Workbench" category="Symmetric Cryptography" status="Legacy">Run real RC5-32 block encryption with add-rotate-XOR rounds and inspect data-dependent rotation amounts.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="RC5 parameters">
          <div className="grid gap-4">
            <Field label="64-bit block hex"><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
            <Field label="Key hex"><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
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
      <Card title="Round trace">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Round</th><th className="p-2 text-left">A word</th><th className="p-2 text-left">B word</th><th className="p-2 text-left">A rotation</th><th className="p-2 text-left">B rotation</th></tr></thead>
            <tbody>
              {result.trace.map((row) => <tr key={`${operation}-${row.round}-${row.a}-${row.b}`} className="border-t border-slate-100"><td className="p-2 font-mono">{row.round}</td><td className="p-2 font-mono">{wordHex(row.a)}</td><td className="p-2 font-mono">{wordHex(row.b)}</td><td className="p-2 font-mono">{row.rotationA}</td><td className="p-2 font-mono">{row.rotationB}</td></tr>)}
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
