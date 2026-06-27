import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { textBlocks, xorHex } from "../../../lib/cryptoDemos";
import { asciiToHex } from "../../../lib/format";

export default function CBCModePage() {
  const [plain, setPlain] = useState("CBC chains every block to the previous ciphertext.");
  const [iv, setIv] = useState("cbc iv block 123");
  const [activeBlock, setActiveBlock] = useState(0);
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
        <label className="mb-4 block text-sm font-medium text-slate-700">Active block: {Math.min(activeBlock, Math.max(chain.length - 1, 0))}<input className="ml-3 w-48 align-middle" type="range" min="0" max={Math.max(chain.length - 1, 0)} value={Math.min(activeBlock, Math.max(chain.length - 1, 0))} onChange={(event) => setActiveBlock(Number(event.target.value))} /></label>
        <div className="space-y-3">{chain.map((row) => {
          const active = row.index === Math.min(activeBlock, Math.max(chain.length - 1, 0));
          return <div key={row.index} className={`grid gap-2 rounded-md border p-3 text-xs md:grid-cols-4 ${active ? "border-cyan-300 bg-cyan-50 shadow-sm" : "border-slate-200 bg-slate-50"}`}><div><b>P{row.index}</b><p className="break-all font-mono">{row.block}</p></div><div><b>xor {row.previous}</b><p className="break-all font-mono">{row.xored}</p></div><div><b>encrypt</b><p>{active ? "current block-cipher call" : "block cipher call"}</p></div><div><b>C{row.index}</b><p className="break-all font-mono">{row.cipherConcept}</p></div></div>;
        })}</div>
      </Card>
      <Card title="What changes when one block changes">
        <div className="grid gap-3 text-sm md:grid-cols-4">
          {chain.slice(0, 4).map((row) => <div key={row.index} className={`rounded-md border p-3 ${row.index >= Math.min(activeBlock, Math.max(chain.length - 1, 0)) ? "border-amber-300 bg-amber-50 text-amber-950" : "border-slate-200 bg-white text-slate-600"}`}><p className="font-semibold">C{row.index}</p><p className="mt-1 text-xs">{row.index === Math.min(activeBlock, Math.max(chain.length - 1, 0)) ? "Changed block" : row.index > Math.min(activeBlock, Math.max(chain.length - 1, 0)) ? "Affected by chaining" : "Before the change"}</p></div>)}
        </div>
        <p className="mt-3 text-sm text-slate-600">In CBC encryption, changing one plaintext block changes its ciphertext block and all following chained ciphertext blocks.</p>
      </Card>
      <WarningBadge>CBC needs unpredictable IVs and separate authentication. Do not expose padding error details.</WarningBadge>
    </div>
  );
}
