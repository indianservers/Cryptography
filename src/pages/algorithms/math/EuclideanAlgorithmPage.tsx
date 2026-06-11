import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { extendedGcd, gcdSteps, modInverse, parseBigInt } from "../../../lib/appliedMath";

export default function EuclideanAlgorithmPage() {
  const [aInput, setAInput] = useState("240");
  const [bInput, setBInput] = useState("46");
  const a = useMemo(() => parseBigInt(aInput, 0n), [aInput]);
  const b = useMemo(() => parseBigInt(bInput, 0n), [bInput]);
  const gcd = useMemo(() => gcdSteps(a, b), [a, b]);
  const extended = useMemo(() => extendedGcd(a, b), [a, b]);
  const inverse = useMemo(() => modInverse(a, b), [a, b]);

  return (
    <div className="space-y-6">
      <PageHeader title="Euclidean Algorithm" category="Applied Mathematics" status="Educational">
        Compute gcd(a, b), Bezout coefficients, and modular inverses. This is the workhorse behind RSA key generation, CRT optimization, affine ciphers, and finite-field division.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="a"><input className="field font-mono" value={aInput} onChange={(event) => setAInput(event.target.value)} /></Field>
            <Field label="b / modulus"><input className="field font-mono" value={bInput} onChange={(event) => setBInput(event.target.value)} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => { setAInput("240"); setBInput("46"); }}>GCD sample</button>
            <button className="btn" type="button" onClick={() => { setAInput("17"); setBInput("3120"); }}>RSA inverse sample</button>
            <button className="btn" type="button" onClick={() => { setAInput("5"); setBInput("26"); }}>Affine inverse sample</button>
          </div>
        </Card>

        <Card title="Results">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={gcd.gcd === 1n ? "success" : "warning"}>{gcd.gcd === 1n ? "Coprime" : "Not coprime"}</StatusPill>
              <StatusPill tone={inverse === null ? "warning" : "success"}>{inverse === null ? "No inverse for a mod b" : "Inverse exists"}</StatusPill>
            </div>
            <ValueRow label="gcd(a, b)" value={gcd.gcd.toString()} />
            <ValueRow label="Bezout identity" value={`${extended.x} x ${a} + ${extended.y} x ${b} = ${extended.gcd}`} />
            <ValueRow label="a^-1 mod b" value={inverse?.toString() ?? "not defined"} />
          </div>
        </Card>
      </div>

      <Card title="Euclidean division steps">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">a</th><th className="p-2 text-left">b</th><th className="p-2 text-left">q</th><th className="p-2 text-left">r</th><th className="p-2 text-left">Equation</th></tr></thead>
            <tbody>
              {gcd.steps.map((step, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{step.a.toString()}</td>
                  <td className="p-2 font-mono">{step.b.toString()}</td>
                  <td className="p-2 font-mono">{step.q.toString()}</td>
                  <td className="p-2 font-mono">{step.r.toString()}</td>
                  <td className="p-2 font-mono">{step.a} = {step.q} x {step.b} + {step.r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Extended coefficients">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">r old</th><th className="p-2 text-left">r</th><th className="p-2 text-left">q</th><th className="p-2 text-left">s old</th><th className="p-2 text-left">s</th><th className="p-2 text-left">t old</th><th className="p-2 text-left">t</th></tr></thead>
            <tbody>
              {extended.steps.map((step, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{step.a.toString()}</td>
                  <td className="p-2 font-mono">{step.b.toString()}</td>
                  <td className="p-2 font-mono">{step.q.toString()}</td>
                  <td className="p-2 font-mono">{step.oldS.toString()}</td>
                  <td className="p-2 font-mono">{step.s.toString()}</td>
                  <td className="p-2 font-mono">{step.oldT.toString()}</td>
                  <td className="p-2 font-mono">{step.t.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
