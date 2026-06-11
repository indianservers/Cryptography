import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { isPrimeTrial, mod, modInverse, modPowTrace, parseBigInt } from "../../../lib/appliedMath";

const fieldElements = (p: bigint) => {
  const count = Number(p > 19n ? 19n : p < 2n ? 2n : p);
  return Array.from({ length: count }, (_, index) => BigInt(index));
};

export default function FiniteFieldsPage() {
  const [pInput, setPInput] = useState("17");
  const [aInput, setAInput] = useState("5");
  const [bInput, setBInput] = useState("9");
  const [exponentInput, setExponentInput] = useState("3");
  const p = useMemo(() => parseBigInt(pInput, 17n), [pInput]);
  const a = useMemo(() => parseBigInt(aInput, 0n), [aInput]);
  const b = useMemo(() => parseBigInt(bInput, 0n), [bInput]);
  const exponent = useMemo(() => parseBigInt(exponentInput, 0n), [exponentInput]);
  const primality = useMemo(() => isPrimeTrial(p), [p]);
  const inverseB = useMemo(() => modInverse(b, p), [b, p]);
  const elements = useMemo(() => fieldElements(p), [p]);
  const power = useMemo(() => modPowTrace(a, exponent, p), [a, exponent, p]);

  return (
    <div className="space-y-6">
      <PageHeader title="Finite Fields GF(p)" category="Applied Mathematics" status="Educational">
        Perform arithmetic in a prime field, where values wrap modulo p and every nonzero element has an inverse. Prime fields appear in Diffie-Hellman, DSA, Schnorr signatures, and elliptic curve formulas.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Field inputs">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="prime p"><input className="field font-mono" value={pInput} onChange={(event) => setPInput(event.target.value)} /></Field>
            <Field label="a"><input className="field font-mono" value={aInput} onChange={(event) => setAInput(event.target.value)} /></Field>
            <Field label="b"><input className="field font-mono" value={bInput} onChange={(event) => setBInput(event.target.value)} /></Field>
            <Field label="exponent e"><input className="field font-mono" value={exponentInput} onChange={(event) => setExponentInput(event.target.value)} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => { setPInput("17"); setAInput("5"); setBInput("9"); setExponentInput("3"); }}>GF(17)</button>
            <button className="btn" type="button" onClick={() => { setPInput("23"); setAInput("7"); setBInput("11"); setExponentInput("5"); }}>GF(23)</button>
          </div>
        </Card>

        <Card title="Field operations">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={primality.prime ? "success" : "error"}>{primality.prime ? "p is prime" : "p should be prime"}</StatusPill>
              <StatusPill tone={inverseB === null ? "warning" : "success"}>{inverseB === null ? "b has no inverse" : "b is invertible"}</StatusPill>
            </div>
            <ValueRow label="a + b in GF(p)" value={mod(a + b, p).toString()} />
            <ValueRow label="a - b in GF(p)" value={mod(a - b, p).toString()} />
            <ValueRow label="a x b in GF(p)" value={mod(a * b, p).toString()} />
            <ValueRow label="b^-1 in GF(p)" value={inverseB?.toString() ?? "not defined"} />
            <ValueRow label="a / b in GF(p)" value={inverseB === null ? "not defined" : mod(a * inverseB, p).toString()} />
            <ValueRow label="a^e in GF(p)" value={power.value.toString()} />
          </div>
        </Card>
      </div>

      <Card title="Addition and multiplication tables">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">+</th>{elements.map((element) => <th key={element.toString()} className="p-2 text-left font-mono">{element.toString()}</th>)}</tr></thead>
              <tbody>{elements.map((row) => <tr key={row.toString()} className="border-t border-slate-100"><th className="p-2 text-left font-mono">{row.toString()}</th>{elements.map((col) => <td key={col.toString()} className="p-2 font-mono">{mod(row + col, p).toString()}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">x</th>{elements.map((element) => <th key={element.toString()} className="p-2 text-left font-mono">{element.toString()}</th>)}</tr></thead>
              <tbody>{elements.map((row) => <tr key={row.toString()} className="border-t border-slate-100"><th className="p-2 text-left font-mono">{row.toString()}</th>{elements.map((col) => <td key={col.toString()} className="p-2 font-mono">{mod(row * col, p).toString()}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      </Card>

      <Card title="Why fields matter">
        <WarningBadge>GF(p) only has field behavior when p is prime. Composite moduli can have zero divisors and missing inverses, which changes the algebra cryptographic protocols rely on.</WarningBadge>
      </Card>
    </div>
  );
}
