import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { textBlocks, xorHex } from "../../../lib/cryptoDemos";
import { asciiToHex } from "../../../lib/format";

export default function CBCModePage() {
  const [plain, setPlain] = useState("CBC chains every block to the previous ciphertext.");
  const [iv, setIv] = useState("cbc iv block 123");
  const blocks = useMemo(() => textBlocks(plain, 16), [plain]);
  const ivHex = asciiToHex(iv, 16);
  const chain = useMemo(() => {
    let previous = ivHex;
    return blocks.map((block, index) => {
      const xored = xorHex(block, previous);
      const cipherConcept = xored.split("").reverse().join("");
      previous = cipherConcept;
      return { index, block, previous: index === 0 ? ivHex : "C" + (index - 1), xored, cipherConcept };
    });
  }, [blocks, ivHex]);

  return (
    <div className="space-y-6">
      <PageHeader title="CBC Mode" category="Modes of Operation" status="Legacy">CBC XORs each plaintext block with the previous ciphertext block before block-cipher encryption.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Plaintext and IV">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="IV ASCII" value={iv} expectedBytes={16} hint="Converted internally to the CBC initialization vector."><input className="field font-mono" value={iv} onChange={(event) => setIv(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="CBC formula">
          <p className="text-sm text-slate-600"><span className="font-mono">C_i = E_k(P_i xor C_(i-1))</span>, with the IV used for block zero. This page uses a reversible visual stand-in for the block cipher so the chaining is clear.</p>
        </Card>
      </div>
      <Card title="Chained block flow">
        <div className="space-y-3">{chain.map((row) => <div key={row.index} className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs md:grid-cols-4"><div><b>P{row.index}</b><p className="break-all font-mono">{row.block}</p></div><div><b>xor {row.previous}</b><p className="break-all font-mono">{row.xored}</p></div><div><b>encrypt</b><p>block cipher call</p></div><div><b>C{row.index}</b><p className="break-all font-mono">{row.cipherConcept}</p></div></div>)}</div>
      </Card>
      <WarningBadge>CBC needs unpredictable IVs and separate authentication. Do not expose padding error details.</WarningBadge>
    </div>
  );
}
