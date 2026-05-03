import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { gcd, modInv } from "../../../../lib/cryptoDemos";

export default function RSAKeyGenerationPage() {
  const [p, setP] = useState("61");
  const [q, setQ] = useState("53");
  const [e, setE] = useState("17");
  const values = useMemo(() => {
    const primeP = BigInt(p || "0");
    const primeQ = BigInt(q || "0");
    const exponent = BigInt(e || "0");
    const n = primeP * primeQ;
    const phi = (primeP - 1n) * (primeQ - 1n);
    const g = gcd(exponent, phi);
    const d = g === 1n ? modInv(exponent, phi) : null;
    return { primeP, primeQ, exponent, n, phi, g, d };
  }, [e, p, q]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Key Generation" category="Public Key Cryptography" status="Educational">Generate a small educational RSA key pair by computing n, phi(n), gcd(e, phi), and d as a modular inverse.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Prime and exponent inputs">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="p"><input className="field font-mono" value={p} onChange={(event) => setP(event.target.value)} /></Field>
            <Field label="q"><input className="field font-mono" value={q} onChange={(event) => setQ(event.target.value)} /></Field>
            <Field label="e"><input className="field font-mono" value={e} onChange={(event) => setE(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Computed key material">
          <div className="space-y-3">
            <ValueRow label="n = p * q" value={values.n.toString()} />
            <ValueRow label="phi(n) = (p - 1)(q - 1)" value={values.phi.toString()} />
            <ValueRow label="gcd(e, phi)" value={values.g.toString()} />
            <ValueRow label="d = e^-1 mod phi" value={values.d?.toString() ?? "No inverse: choose e coprime to phi"} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Public key"><ValueRow label="(n, e)" value={`(${values.n}, ${values.exponent})`} /></Card>
        <Card title="Private key"><ValueRow label="(n, d)" value={values.d ? `(${values.n}, ${values.d})` : "invalid until gcd(e, phi) = 1"} /></Card>
      </div>
      <WarningBadge>These numbers are intentionally tiny. Production RSA keys are generated with vetted libraries, secure randomness, primality tests, and safe padding.</WarningBadge>
    </div>
  );
}
