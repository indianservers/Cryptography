import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { discreteLogBruteForce, parseBigInt } from "../../../lib/appliedMath";

export default function DiscreteLogPage() {
  const [baseInput, setBaseInput] = useState("5");
  const [targetInput, setTargetInput] = useState("8");
  const [modulusInput, setModulusInput] = useState("23");
  const [maxInput, setMaxInput] = useState("100");
  const base = parseBigInt(baseInput, 1n);
  const target = parseBigInt(targetInput, 1n);
  const modulus = parseBigInt(modulusInput, 23n);
  const max = Number(maxInput) || 100;
  const result = useMemo(() => discreteLogBruteForce(base, target, modulus, max), [base, target, modulus, max]);

  return (
    <div className="space-y-6">
      <PageHeader title="Discrete Logarithm" category="Applied Mathematics" status="Educational">
        Find x such that g^x = h mod p by brute force in a tiny group. This shows the problem Diffie-Hellman and DSA rely on being hard at real sizes.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="base g"><input className="field font-mono" value={baseInput} onChange={(e) => setBaseInput(e.target.value)} /></Field>
            <Field label="target h"><input className="field font-mono" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} /></Field>
            <Field label="modulus p"><input className="field font-mono" value={modulusInput} onChange={(e) => setModulusInput(e.target.value)} /></Field>
            <Field label="max exponent"><input className="field font-mono" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Result">
          <div className="grid gap-3">
            <StatusPill tone={result.exponent === null ? "warning" : "success"}>{result.exponent === null ? "No exponent in range" : "Discrete log found"}</StatusPill>
            <ValueRow label="x" value={result.exponent?.toString() ?? "not found"} />
            <ValueRow label="equation" value={result.exponent === null ? "not solved" : `${base}^${result.exponent} = ${target} mod ${modulus}`} />
          </div>
        </Card>
      </div>
      <Card title="Brute force trace">
        <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">x</th><th className="p-2 text-left">g^x mod p</th><th className="p-2 text-left">Match</th></tr></thead><tbody>{result.rows.slice(0, 500).map((row) => <tr key={row.exponent.toString()} className={`border-t border-slate-100 ${row.match ? "bg-emerald-50" : ""}`}><td className="p-2 font-mono">{row.exponent.toString()}</td><td className="p-2 font-mono">{row.value.toString()}</td><td className="p-2">{row.match ? "yes" : "no"}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
