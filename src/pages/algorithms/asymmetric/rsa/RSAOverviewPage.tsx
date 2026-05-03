import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { modPow, modPowTrace } from "../../../../lib/cryptoDemos";

export default function RSAOverviewPage() {
  const [message, setMessage] = useState("65");
  const [e, setE] = useState("17");
  const [d, setD] = useState("2753");
  const [n, setN] = useState("3233");
  const values = useMemo(() => {
    const m = BigInt(message || "0");
    const pub = BigInt(e || "0");
    const priv = BigInt(d || "0");
    const mod = BigInt(n || "1");
    const c = modPow(m, pub, mod);
    return { m, c, recovered: modPow(c, priv, mod), trace: modPowTrace(m, pub, mod) };
  }, [d, e, message, n]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Overview" category="Public Key Cryptography" status="Modern">A small-number RSA playground connecting encryption, decryption, modular exponentiation, and padding warnings.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Toy RSA values">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Message integer m"><input className="field font-mono" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Modulus n"><input className="field font-mono" value={n} onChange={(event) => setN(event.target.value)} /></Field>
            <Field label="Public exponent e"><input className="field font-mono" value={e} onChange={(event) => setE(event.target.value)} /></Field>
            <Field label="Private exponent d"><input className="field font-mono" value={d} onChange={(event) => setD(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="RSA operation">
          <div className="space-y-3">
            <ValueRow label="c = m^e mod n" value={values.c.toString()} />
            <ValueRow label="m = c^d mod n" value={values.recovered.toString()} />
          </div>
        </Card>
      </div>
      <Card title="Modular exponentiation table">
        <table className="w-full overflow-hidden rounded-md border border-slate-200 text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Exponent bit</th><th className="p-2 text-left">Base square</th><th className="p-2 text-left">Accumulated result</th></tr></thead><tbody>{values.trace.map((row, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{row.bit}</td><td className="p-2 font-mono">{row.base}</td><td className="p-2 font-mono">{row.result}</td></tr>)}</tbody></table>
      </Card>
      <WarningBadge>Raw RSA is unsafe. Real encryption uses OAEP; real signatures use PSS or another protocol-approved encoding.</WarningBadge>
    </div>
  );
}
