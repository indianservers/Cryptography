import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ecbBlocks, textToHexValue } from "../../../lib/attacks";

const repeatedText = "PAYMENT-BLOCK-001PAYMENT-BLOCK-001PAYMENT-BLOCK-002PAYMENT-BLOCK-001";

export default function ECBPatternLeakagePage() {
  const [hexInput, setHexInput] = useState(textToHexValue(repeatedText));
  const [blockBytes, setBlockBytes] = useState(16);
  const blocks = useMemo(() => ecbBlocks(hexInput, blockBytes), [hexInput, blockBytes]);
  const repeated = blocks.filter((block) => block.repeated);
  const repeatedGroups = new Set(repeated.map((block) => block.block)).size;

  return (
    <div className="space-y-6">
      <PageHeader title="ECB Pattern Leakage" category="Cryptanalysis and Attacks" status="Unsafe">
        Detect repeated ciphertext blocks and visualize how ECB mode leaks equality patterns. Paste hex ciphertext or load the sample.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Ciphertext blocks">
          <div className="grid gap-4">
            <Field label="Hex ciphertext">
              <textarea className="field min-h-40 font-mono" value={hexInput} onChange={(event) => setHexInput(event.target.value)} />
            </Field>
            <Field label="Block size in bytes">
              <input className="field font-mono" type="number" min={1} max={64} value={blockBytes} onChange={(event) => setBlockBytes(Number(event.target.value))} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary" type="button" onClick={() => setHexInput(textToHexValue(repeatedText))}>Load repeated sample</button>
              <button className="btn" type="button" onClick={() => setHexInput("")}>Clear</button>
            </div>
          </div>
        </Card>

        <Card title="Leakage result">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={repeatedGroups ? "error" : "success"}>{repeatedGroups ? "Repeated blocks found" : "No repeated full blocks"}</StatusPill>
              <StatusPill tone="info">{blocks.length} blocks</StatusPill>
            </div>
            <ValueRow label="Repeated block groups" value={repeatedGroups.toString()} />
            <ValueRow label="Repeated block instances" value={repeated.length.toString()} />
            <WarningBadge>ECB does not randomize equal plaintext blocks. Repeated ciphertext blocks can reveal layouts, records, or image structure.</WarningBadge>
          </div>
        </Card>
      </div>

      <Card title="Block grid">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {blocks.map((block) => (
            <div key={`${block.index}:${block.block}`} className={`rounded-md border p-3 ${block.repeated ? "border-red-200 bg-red-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs font-semibold uppercase text-slate-500">
                <span>Block {block.index}</span>
                <span>{block.count}x</span>
              </div>
              <div className="break-all font-mono text-xs">{block.block}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card title="ECB and CBC side by side">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 font-semibold">ECB keeps repeated patterns visible</div>
            <div className="grid grid-cols-8 gap-1 rounded-md border border-red-200 bg-red-50 p-3">
              {Array.from({ length: 64 }, (_, index) => {
                const repeatedColor = index % 9 === 0 || index % 9 === 1 || Math.floor(index / 8) === 2 ? "bg-red-500" : "bg-red-100";
                return <span key={index} className={`aspect-square rounded-sm ${repeatedColor}`} />;
              })}
            </div>
          </div>
          <div>
            <div className="mb-2 font-semibold">CBC hides equality with chaining</div>
            <div className="grid grid-cols-8 gap-1 rounded-md border border-emerald-200 bg-emerald-50 p-3">
              {Array.from({ length: 64 }, (_, index) => <span key={index} className="aspect-square rounded-sm" style={{ backgroundColor: `hsl(${(index * 47) % 360} 65% 55%)` }} />)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700">The pattern is still visible in ECB because identical plaintext blocks encrypt to identical ciphertext blocks under the same key.</p>
      </Card>
    </div>
  );
}
