import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { eulerPhi, parseBigInt, primitiveRootRows } from "../../../lib/appliedMath";

export default function PrimitiveRootsPage() {
  const [modulusInput, setModulusInput] = useState("23");
  const modulus = parseBigInt(modulusInput, 23n);
  const rows = useMemo(() => primitiveRootRows(modulus), [modulus]);
  const generators = rows.filter((row) => row.generator);

  return (
    <div className="space-y-6">
      <PageHeader title="Primitive Roots and Generators" category="Applied Mathematics" status="Educational">
        Inspect multiplicative orders modulo n and find generators. Generator choice matters for Diffie-Hellman, DSA-style groups, and cyclic subgroup reasoning.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Modulus"><Field label="modulus n"><input className="field font-mono" value={modulusInput} onChange={(e) => setModulusInput(e.target.value)} /></Field></Card>
        <Card title="Generator summary">
          <div className="grid gap-3">
            <StatusPill tone={generators.length ? "success" : "warning"}>{generators.length ? "Generators found" : "No generator in scanned range"}</StatusPill>
            <ValueRow label="phi(n)" value={eulerPhi(modulus).toString()} />
            <ValueRow label="primitive roots" value={generators.map((row) => row.candidate.toString()).join(", ") || "none"} />
          </div>
        </Card>
      </div>
      <Card title="Order table">
        <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">candidate g</th><th className="p-2 text-left">order</th><th className="p-2 text-left">generator?</th></tr></thead><tbody>{rows.map((row) => <tr key={row.candidate.toString()} className={`border-t border-slate-100 ${row.generator ? "bg-emerald-50" : ""}`}><td className="p-2 font-mono">{row.candidate.toString()}</td><td className="p-2 font-mono">{row.order?.toString() ?? "not unit"}</td><td className="p-2">{row.generator ? "yes" : "no"}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
