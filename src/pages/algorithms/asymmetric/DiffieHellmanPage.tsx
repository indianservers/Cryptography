import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { modPow, modPowTrace } from "../../../lib/cryptoDemos";

export default function DiffieHellmanPage() {
  const [p, setP] = useState("23");
  const [g, setG] = useState("5");
  const [alice, setAlice] = useState("6");
  const [bob, setBob] = useState("15");
  const values = useMemo(() => {
    const prime = BigInt(p || "23");
    const generator = BigInt(g || "5");
    const a = BigInt(alice || "1");
    const b = BigInt(bob || "1");
    const A = modPow(generator, a, prime);
    const B = modPow(generator, b, prime);
    return { prime, generator, a, b, A, B, aliceSecret: modPow(B, a, prime), bobSecret: modPow(A, b, prime), traceA: modPowTrace(generator, a, prime), traceB: modPowTrace(generator, b, prime) };
  }, [alice, bob, g, p]);

  return (
    <div className="space-y-6">
      <PageHeader title="Diffie-Hellman Key Exchange" category="Public Key Cryptography" status="Educational">A finite-field key exchange using toy numbers so every modular exponentiation step is visible.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Public group and private values">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="p prime"><input className="field font-mono" value={p} onChange={(event) => setP(event.target.value)} /></Field>
            <Field label="g generator"><input className="field font-mono" value={g} onChange={(event) => setG(event.target.value)} /></Field>
            <Field label="Alice private a"><input className="field font-mono" value={alice} onChange={(event) => setAlice(event.target.value)} /></Field>
            <Field label="Bob private b"><input className="field font-mono" value={bob} onChange={(event) => setBob(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Public values and shared secret">
          <div className="space-y-3">
            <ValueRow label="Alice public A = g^a mod p" value={values.A.toString()} />
            <ValueRow label="Bob public B = g^b mod p" value={values.B.toString()} />
            <ValueRow label="Alice computes B^a mod p" value={values.aliceSecret.toString()} />
            <ValueRow label="Bob computes A^b mod p" value={values.bobSecret.toString()} />
          </div>
        </Card>
      </div>
      <Card title="Alice and Bob exchange picture">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sky-950">
            <div className="text-xs font-semibold uppercase">Alice</div>
            <div className="mt-2 font-mono text-sm">secret a={values.a.toString()}</div>
            <div className="mt-1 font-mono text-sm">sends A={values.A.toString()}</div>
            <div className="mt-3 rounded-md bg-white/70 p-2 font-mono text-lg">final secret {values.aliceSecret.toString()}</div>
          </div>
          <div className="flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 p-3 text-center text-sm font-semibold text-slate-700">
            A and B cross the network
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-950">
            <div className="text-xs font-semibold uppercase">Bob</div>
            <div className="mt-2 font-mono text-sm">secret b={values.b.toString()}</div>
            <div className="mt-1 font-mono text-sm">sends B={values.B.toString()}</div>
            <div className="mt-3 rounded-md bg-white/70 p-2 font-mono text-lg">final secret {values.bobSecret.toString()}</div>
          </div>
        </div>
        <div className={`mt-3 rounded-md border p-3 text-sm font-semibold ${values.aliceSecret === values.bobSecret ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          Shared secret match: {values.aliceSecret.toString()} {values.aliceSecret === values.bobSecret ? "=" : "!="} {values.bobSecret.toString()}
        </div>
      </Card>
      <Card title="Modular exponentiation visualization">
        <div className="grid gap-6 xl:grid-cols-2">
          {[["Alice public exponentiation", values.traceA], ["Bob public exponentiation", values.traceB]].map(([title, rows]) => (
            <div key={title as string} className="overflow-auto rounded-md border border-slate-200">
              <div className="bg-slate-100 p-2 font-semibold">{title as string}</div>
              <table className="w-full text-sm"><thead><tr><th className="p-2 text-left">Bit</th><th className="p-2 text-left">Base</th><th className="p-2 text-left">Result</th></tr></thead><tbody>{(rows as typeof values.traceA).map((row, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{row.bit}</td><td className="p-2 font-mono">{row.base}</td><td className="p-2 font-mono">{row.result}</td></tr>)}</tbody></table>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Man-in-the-middle warning diagram">
        <div className="grid gap-3 md:grid-cols-5">
          {["Alice", "A", "Mallory swaps public values", "B", "Bob"].map((node) => <div key={node} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-center text-sm font-semibold text-amber-900">{node}</div>)}
        </div>
      </Card>
      <WarningBadge>Unauthenticated Diffie-Hellman does not prove who owns the public value. Real protocols authenticate the exchange.</WarningBadge>
    </div>
  );
}
