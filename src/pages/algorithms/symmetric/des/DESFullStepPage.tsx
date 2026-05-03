import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { MatrixView } from "../../../../components/common/MatrixView";
import { StepControls } from "../../../../components/common/StepControls";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { desSBoxOutput } from "./desEducationalCore";

const rotate = (value: string, amount: number) => value.slice(amount) + value.slice(0, amount);

export default function DESFullStepPage() {
  const [block, setBlock] = useState("0123456789abcdef");
  const [key, setKey] = useState("133457799bbcdff1");
  const [round, setRound] = useState(0);
  const rounds = useMemo(() => {
    let left = BigInt("0x" + block.replace(/[^0-9a-f]/gi, "").padEnd(16, "0").slice(0, 16)).toString(2).padStart(64, "0").slice(0, 32);
    let right = BigInt("0x" + block.replace(/[^0-9a-f]/gi, "").padEnd(16, "0").slice(0, 16)).toString(2).padStart(64, "0").slice(32);
    const keyBits = BigInt("0x" + key.replace(/[^0-9a-f]/gi, "").padEnd(16, "0").slice(0, 16)).toString(2).padStart(64, "0").slice(0, 56);
    return Array.from({ length: 16 }, (_, index) => {
      const roundKey = rotate(keyBits, index + 1).slice(0, 48);
      const expanded = right.padEnd(48, right).slice(0, 48);
      const xored = expanded.split("").map((bit, i) => bit === roundKey[i] ? "0" : "1").join("");
      const f = Array.from({ length: 8 }, (_, i) => desSBoxOutput(i, xored.slice(i * 6, i * 6 + 6))).join("");
      const nextRight = left.split("").map((bit, i) => bit === f[i] ? "0" : "1").join("");
      const row = { round: index + 1, left, right, expanded, roundKey, xored, f, nextLeft: right, nextRight };
      left = row.nextLeft;
      right = row.nextRight;
      return row;
    });
  }, [block, key]);
  const active = rounds[round];

  return (
    <div className="space-y-6">
      <PageHeader title="DES Full Step Visualizer" category="Block Ciphers" status="Deprecated">A 16-round Feistel walkthrough showing expansion, round-key XOR, S-box compression, and L/R swapping for each DES-style round.</PageHeader>
      <Card title="Block, key, and round selector">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="64-bit block hex"><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
          <Field label="64-bit key hex"><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
        </div>
        <div className="mt-4"><StepControls step={round} max={15} onStep={setRound} /></div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title={`Round ${active.round} L/R values`}>
          <div className="space-y-3">
            <ValueRow label="L before" value={active.left} />
            <ValueRow label="R before" value={active.right} />
            <ValueRow label="L after swap" value={active.nextLeft} />
            <ValueRow label="R after f xor L" value={active.nextRight} />
          </div>
        </Card>
        <Card title="Feistel internals">
          <div className="space-y-3">
            <ValueRow label="Expansion E" value={active.expanded} />
            <ValueRow label="Round key" value={active.roundKey} />
            <ValueRow label="S-box output" value={active.f} />
          </div>
        </Card>
      </div>
      <Card title="16-round timeline">
        <MatrixView columns={4} values={rounds.map((item) => `R${item.round}: ${item.f.slice(0, 8)}`)} changed={[round]} />
      </Card>
      <WarningBadge>This is an educational DES-structure visualizer. DES is deprecated and should not protect real data.</WarningBadge>
    </div>
  );
}
