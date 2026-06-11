import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { gf256Multiply } from "../../../lib/appliedMath";

const parseByte = (value: string) => Math.max(0, Math.min(255, Number.parseInt(value.replace(/^0x/i, ""), 16) || 0));
const hex = (value: number) => `0x${value.toString(16).padStart(2, "0")}`;

export default function GF256ArithmeticPage() {
  const [aInput, setAInput] = useState("57");
  const [bInput, setBInput] = useState("83");
  const [polyInput, setPolyInput] = useState("11b");
  const a = parseByte(aInput);
  const b = parseByte(bInput);
  const polynomial = Number.parseInt(polyInput.replace(/^0x/i, ""), 16) || 0x11b;
  const result = useMemo(() => gf256Multiply(a, b, polynomial), [a, b, polynomial]);

  return (
    <div className="space-y-6">
      <PageHeader title="GF(2^8) Arithmetic" category="Applied Mathematics" status="Educational">
        Multiply bytes in the AES finite field using the irreducible polynomial 0x11b. This is the arithmetic behind MixColumns and many byte-level crypto transforms.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Inputs">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="a hex byte"><input className="field font-mono" value={aInput} onChange={(e) => setAInput(e.target.value)} /></Field>
            <Field label="b hex byte"><input className="field font-mono" value={bInput} onChange={(e) => setBInput(e.target.value)} /></Field>
            <Field label="polynomial"><input className="field font-mono" value={polyInput} onChange={(e) => setPolyInput(e.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Result">
          <div className="grid gap-3">
            <ValueRow label="a XOR b" value={hex(a ^ b)} />
            <ValueRow label="a x b in GF(2^8)" value={hex(result.value)} />
            <ValueRow label="AES sample" value="0x57 x 0x83 = 0xc1 with polynomial 0x11b" />
          </div>
        </Card>
      </div>
      <Card title="Russian peasant multiplication trace">
        <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">round</th><th className="p-2 text-left">left</th><th className="p-2 text-left">right</th><th className="p-2 text-left">result</th><th className="p-2 text-left">action</th></tr></thead><tbody>{result.steps.map((step) => <tr key={step.round} className="border-t border-slate-100"><td className="p-2 font-mono">{step.round}</td><td className="p-2 font-mono">{hex(step.left)}</td><td className="p-2 font-mono">{hex(step.right)}</td><td className="p-2 font-mono">{hex(step.result)}</td><td className="p-2">{step.action}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
