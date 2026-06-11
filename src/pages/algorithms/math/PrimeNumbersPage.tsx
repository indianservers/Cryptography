import { useMemo, useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { eulerPhi, factorizeTrial, isPrimeTrial, parseBigInt, sieve } from "../../../lib/appliedMath";

const formatFactorization = (factors: ReturnType<typeof factorizeTrial>) => {
  if (!factors.length) return "No prime factors for values below 2.";
  return factors.map((factor) => factor.exponent === 1 ? factor.prime.toString() : `${factor.prime}^${factor.exponent}`).join(" x ");
};

export default function PrimeNumbersPage() {
  const [numberInput, setNumberInput] = useState("3233");
  const [sieveLimit, setSieveLimit] = useState("100");
  const n = useMemo(() => parseBigInt(numberInput, 0n), [numberInput]);
  const limit = useMemo(() => Number.parseInt(sieveLimit, 10) || 100, [sieveLimit]);
  const primality = useMemo(() => isPrimeTrial(n), [n]);
  const factors = useMemo(() => factorizeTrial(n), [n]);
  const primes = useMemo(() => sieve(limit), [limit]);

  return (
    <div className="space-y-6">
      <PageHeader title="Prime Numbers" category="Applied Mathematics" status="Educational">
        Explore primality, factorization, Euler's phi function, and prime lists used as the arithmetic backbone of RSA, Diffie-Hellman groups, finite fields, and many signature schemes.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Prime inspector">
          <div className="grid gap-4">
            <Field label="Integer n">
              <input className="field font-mono" value={numberInput} onChange={(event) => setNumberInput(event.target.value)} />
            </Field>
            <Field label="Prime list limit">
              <input className="field font-mono" type="number" min={2} max={10000} value={sieveLimit} onChange={(event) => setSieveLimit(event.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary" type="button" onClick={() => setNumberInput("3233")}><Calculator className="h-4 w-4" />RSA toy n</button>
              <button className="btn" type="button" onClick={() => setNumberInput("65537")}>Fermat prime</button>
              <button className="btn" type="button" onClick={() => { setNumberInput("97"); setSieveLimit("100"); }}><RotateCcw className="h-4 w-4" />Reset</button>
            </div>
          </div>
        </Card>

        <Card title="Number properties">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={primality.prime ? "success" : "warning"}>{primality.prime ? "Prime by trial division" : "Composite or not prime"}</StatusPill>
              <StatusPill tone="info">Checked to {primality.checkedTo.toString()}</StatusPill>
            </div>
            <ValueRow label="Factorization" value={formatFactorization(factors)} />
            <ValueRow label="Euler phi(n)" value={eulerPhi(n).toString()} />
            <ValueRow label="Smallest divisor witness" value={primality.witness?.toString() ?? "none found"} />
          </div>
        </Card>
      </div>

      <Card title="Sieve of Eratosthenes">
        <div className="mb-3 text-sm text-slate-600">Primes up to {Math.max(2, Math.min(10000, limit)).toLocaleString()}.</div>
        <div className="flex flex-wrap gap-2">
          {primes.map((prime) => <span key={prime} className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-sm text-slate-700">{prime}</span>)}
        </div>
      </Card>

      <Card title="Cryptography connection">
        <WarningBadge>Real cryptographic primes are hundreds or thousands of bits. This page uses trial division and a small sieve for learning, not production prime generation.</WarningBadge>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="panel-muted"><div className="font-semibold">RSA</div><p className="mt-1 text-sm text-slate-600">n = p x q is easy to build and hard to factor when p and q are large random primes.</p></div>
          <div className="panel-muted"><div className="font-semibold">Diffie-Hellman</div><p className="mt-1 text-sm text-slate-600">Prime moduli define groups where exponentiation is efficient and discrete logs are hard.</p></div>
          <div className="panel-muted"><div className="font-semibold">Finite fields</div><p className="mt-1 text-sm text-slate-600">Prime p lets arithmetic wrap cleanly inside GF(p), where every nonzero element has an inverse.</p></div>
        </div>
      </Card>
    </div>
  );
}
