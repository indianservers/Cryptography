import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { modPow } from "../../../lib/cryptoDemos";

export default function ElGamalPage() {
  const [p, setP] = useState("467");
  const [g, setG] = useState("2");
  const [secret, setSecret] = useState("127");
  const [message, setMessage] = useState("123");
  const [k, setK] = useState("59");
  const values = useMemo(() => {
    const prime = BigInt(p || "0");
    const generator = BigInt(g || "0");
    const x = BigInt(secret || "0");
    const m = BigInt(message || "0");
    const randomK = BigInt(k || "0");
    const y = modPow(generator, x, prime);
    const c1 = modPow(generator, randomK, prime);
    const shared = modPow(y, randomK, prime);
    const c2 = (m * shared) % prime;
    return { prime, generator, x, m, randomK, y, c1, shared, c2 };
  }, [g, k, message, p, secret]);

  return (
    <div className="space-y-6">
      <PageHeader title="ElGamal" category="Public Key Cryptography" status="Educational">ElGamal encrypts one message into two values: c1 carries the fresh random key, and c2 hides the message with the shared secret.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Toy inputs">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Prime p"><input className="field font-mono" value={p} onChange={(event) => setP(event.target.value)} /></Field>
            <Field label="Generator g"><input className="field font-mono" value={g} onChange={(event) => setG(event.target.value)} /></Field>
            <Field label="Secret key x"><input className="field font-mono border-rose-200 bg-rose-50" value={secret} onChange={(event) => setSecret(event.target.value)} /></Field>
            <Field label="Message m"><input className="field font-mono" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Fresh random k"><input className="field font-mono" value={k} onChange={(event) => setK(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Public vs secret material">
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Public key y = g^x mod p" value={values.y.toString()} />
            <ValueRow label="Secret key x" value={values.x.toString()} />
            <ValueRow label="Cipher part c1 = g^k mod p" value={values.c1.toString()} />
            <ValueRow label="Cipher part c2 = m * y^k mod p" value={values.c2.toString()} />
          </div>
        </Card>
      </div>
      <Card title="Message becomes two values">
        <div className="grid gap-3 text-sm md:grid-cols-5">
          {["m", "fresh k", "shared secret", "c1", "c2"].map((label, index) => <div key={label} className={`rounded-md border p-3 ${index >= 3 ? "border-emerald-300 bg-emerald-50" : index === 2 ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}><p className="text-xs font-semibold uppercase text-slate-500">{label}</p><p className="mt-1 break-all font-mono font-bold">{[values.m, values.randomK, values.shared, values.c1, values.c2][index].toString()}</p></div>)}
        </div>
      </Card>
      <WarningBadge>Never reuse k. If the same ElGamal random value is reused, attackers can compare ciphertexts and recover message relationships.</WarningBadge>
    </div>
  );
}
