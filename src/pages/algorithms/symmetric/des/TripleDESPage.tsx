import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { MatrixView } from "../../../../components/common/MatrixView";
import { tripleDesEde } from "./desEducationalCore";

export default function TripleDESPage() {
  const [block, setBlock] = useState("0123456789abcdef");
  const [key1, setKey1] = useState("133457799bbcdff1");
  const [key2, setKey2] = useState("1f1f1f1f0e0e0e0e");
  const [key3, setKey3] = useState("0f1571c947d9e859");
  const [direction, setDirection] = useState<"encrypt" | "decrypt">("encrypt");
  const trace = useMemo(() => tripleDesEde(block, key1, key2, key3, direction === "decrypt"), [block, key1, key2, key3, direction]);

  return (
    <div className="space-y-6">
      <PageHeader title="Triple DES EDE" category="Symmetric Cryptography" status="Legacy">Run a real browser-local 3DES encrypt-decrypt-encrypt chain using the DES permutation tables, key schedule, Feistel rounds, and S-boxes.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="64-bit block and three DES keys">
          <div className="grid gap-4">
            <Field label="Block hex, 64 bits"><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="K1 hex"><input className="field font-mono" value={key1} onChange={(event) => setKey1(event.target.value)} /></Field>
              <Field label="K2 hex"><input className="field font-mono" value={key2} onChange={(event) => setKey2(event.target.value)} /></Field>
              <Field label="K3 hex"><input className="field font-mono" value={key3} onChange={(event) => setKey3(event.target.value)} /></Field>
            </div>
            <Field label="Operation"><select className="field" value={direction} onChange={(event) => setDirection(event.target.value as "encrypt" | "decrypt")}><option value="encrypt">Encrypt EDE</option><option value="decrypt">Decrypt DED</option></select></Field>
          </div>
        </Card>
        <Card title="3DES output">
          <div className="grid gap-3">
            <ValueRow label="Final block hex" value={trace.outputHex} />
            <ValueRow label="Pipeline" value={direction === "encrypt" ? "DES encrypt K1 -> DES decrypt K2 -> DES encrypt K3" : "DES decrypt K3 -> DES encrypt K2 -> DES decrypt K1"} />
            <MatrixView columns={3} values={trace.stages.map((stage, index) => `S${index + 1}: ${stage.outputHex}`)} changed={[2]} />
          </div>
        </Card>
      </div>
      <Card title="Stage internals">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Stage</th><th className="p-2 text-left">Input after IP</th><th className="p-2 text-left">Round 1 key</th><th className="p-2 text-left">Round 16 L/R</th><th className="p-2 text-left">Output</th></tr></thead>
            <tbody>
              {trace.stages.map((stage, index) => {
                const last = stage.rounds[15];
                return <tr key={index} className="border-t border-slate-100"><td className="p-2 font-semibold">Stage {index + 1}</td><td className="break-all p-2 font-mono text-xs">{stage.initialPermutation}</td><td className="break-all p-2 font-mono text-xs">{stage.rounds[0].roundKey}</td><td className="break-all p-2 font-mono text-xs">{last.nextLeft} / {last.nextRight}</td><td className="break-all p-2 font-mono text-xs">{stage.outputHex}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Learning notes">
          <p className="text-sm text-slate-700">3DES applies DES three times to reduce the brute-force weakness of single DES. The EDE form keeps compatibility with old single-DES systems when K1, K2, and K3 collapse to older keying options.</p>
        </Card>
        <Card title="Mistakes and warnings">
          <WarningBadge>3DES is legacy: it has a 64-bit block size and is unsuitable for high-volume modern encryption. Use AES-GCM or ChaCha20-Poly1305 for new systems.</WarningBadge>
        </Card>
      </div>
    </div>
  );
}
