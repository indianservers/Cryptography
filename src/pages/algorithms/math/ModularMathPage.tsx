import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { mod, modInverse, modPowTrace, parseBigInt } from "../../../lib/appliedMath";

export default function ModularMathPage() {
  const [aInput, setAInput] = useState("42");
  const [bInput, setBInput] = useState("17");
  const [mInput, setMInput] = useState("97");
  const [exponentInput, setExponentInput] = useState("13");
  const a = useMemo(() => parseBigInt(aInput, 0n), [aInput]);
  const b = useMemo(() => parseBigInt(bInput, 0n), [bInput]);
  const m = useMemo(() => parseBigInt(mInput, 1n), [mInput]);
  const exponent = useMemo(() => parseBigInt(exponentInput, 0n), [exponentInput]);
  const inverse = useMemo(() => modInverse(a, m), [a, m]);
  const power = useMemo(() => modPowTrace(a, exponent, m), [a, exponent, m]);

  return (
    <div className="space-y-6">
      <PageHeader title="Modular Mathematics" category="Applied Mathematics" status="Educational">
        Work with clock arithmetic: reduction, addition, multiplication, inverses, and fast exponentiation. These operations power RSA, Diffie-Hellman, ElGamal, DSA, ECC, and many classical ciphers.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="a"><input className="field font-mono" value={aInput} onChange={(event) => setAInput(event.target.value)} /></Field>
            <Field label="b"><input className="field font-mono" value={bInput} onChange={(event) => setBInput(event.target.value)} /></Field>
            <Field label="modulus m"><input className="field font-mono" value={mInput} onChange={(event) => setMInput(event.target.value)} /></Field>
            <Field label="exponent e"><input className="field font-mono" value={exponentInput} onChange={(event) => setExponentInput(event.target.value)} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => { setAInput("42"); setBInput("17"); setMInput("97"); setExponentInput("13"); }}>Prime modulus sample</button>
            <button className="btn" type="button" onClick={() => { setAInput("65"); setBInput("12"); setMInput("26"); setExponentInput("5"); }}>Classical cipher sample</button>
            <button className="btn" type="button" onClick={() => { setAInput("42"); setBInput("17"); setMInput("97"); setExponentInput("13"); }}><RotateCcw className="h-4 w-4" />Reset</button>
          </div>
        </Card>

        <Card title="Modular results">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={m > 1n ? "success" : "error"}>{m > 1n ? "Valid modulus" : "Use m > 1"}</StatusPill>
              <StatusPill tone={inverse === null ? "warning" : "success"}>{inverse === null ? "a has no inverse" : "a is invertible"}</StatusPill>
            </div>
            <ValueRow label="a mod m" value={mod(a, m).toString()} />
            <ValueRow label="b mod m" value={mod(b, m).toString()} />
            <ValueRow label="(a + b) mod m" value={mod(a + b, m).toString()} />
            <ValueRow label="(a x b) mod m" value={mod(a * b, m).toString()} />
            <ValueRow label="a^-1 mod m" value={inverse?.toString() ?? "not defined"} />
            <ValueRow label="a^e mod m" value={power.value.toString()} />
          </div>
        </Card>
      </div>

      <Card title="Square-and-multiply trace">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Bit</th><th className="p-2 text-left">Base</th><th className="p-2 text-left">Result</th><th className="p-2 text-left">Action</th></tr></thead>
            <tbody>
              {power.rows.length ? power.rows.map((row, index) => (
                <tr key={`${row.bit}:${index}`} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{row.bit}</td>
                  <td className="p-2 font-mono">{row.base.toString()}</td>
                  <td className="p-2 font-mono">{row.result.toString()}</td>
                  <td className="p-2">{row.action}</td>
                </tr>
              )) : <tr><td className="p-3 text-slate-500" colSpan={4}>Use a positive exponent to see the trace.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
