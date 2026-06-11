import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { chineseRemainder, parseBigInt } from "../../../lib/appliedMath";

const parseRows = (text: string) => text.split(/\r?\n/).map((line) => {
  const [remainder, modulus] = line.split(/[,\s]+/);
  return { remainder: parseBigInt(remainder ?? "0"), modulus: parseBigInt(modulus ?? "1", 1n) };
});

export default function ChineseRemainderPage() {
  const [systems, setSystems] = useState("2 3\n3 5\n2 7");
  const rows = useMemo(() => parseRows(systems), [systems]);
  const result = useMemo(() => chineseRemainder(rows), [rows]);

  return (
    <div className="space-y-6">
      <PageHeader title="Chinese Remainder Theorem" category="Applied Mathematics" status="Educational">
        Combine several congruences into one solution modulo the product of pairwise-coprime moduli. CRT explains RSA private-key speedups and modular reconstruction.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Congruences">
          <Field label="One congruence per line: remainder modulus">
            <textarea className="field min-h-40 font-mono" value={systems} onChange={(event) => setSystems(event.target.value)} />
          </Field>
          <div className="mt-4 flex gap-2"><button className="btn btn-primary" onClick={() => setSystems("2 3\n3 5\n2 7")}>Classic sample</button><button className="btn" onClick={() => setSystems("1 5\n3 7\n4 9")}>Larger sample</button></div>
        </Card>
        <Card title="Solution">
          <div className="grid gap-3">
            <StatusPill tone={result.pairwiseCoprime ? "success" : "warning"}>{result.pairwiseCoprime ? "Pairwise coprime" : "Some moduli are not coprime"}</StatusPill>
            <ValueRow label="x" value={result.solution.toString()} />
            <ValueRow label="modulus product" value={result.modulus.toString()} />
            <ValueRow label="solution form" value={`x = ${result.solution} mod ${result.modulus}`} />
          </div>
        </Card>
      </div>
      <Card title="CRT construction steps">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">a_i</th><th className="p-2 text-left">m_i</th><th className="p-2 text-left">M_i</th><th className="p-2 text-left">inverse</th><th className="p-2 text-left">term</th></tr></thead>
            <tbody>{result.steps.map((step, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{step.remainder.toString()}</td><td className="p-2 font-mono">{step.modulus.toString()}</td><td className="p-2 font-mono">{step.partial.toString()}</td><td className="p-2 font-mono">{step.inverse?.toString() ?? "none"}</td><td className="p-2 font-mono">{step.term.toString()}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
