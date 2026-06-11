import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { factorTrialRows, modPow, parseBigInt, rsaPrivateFromFactors } from "../../../lib/attacks";

export default function RSAFactorizationDemoPage() {
  const [nInput, setNInput] = useState("3233");
  const [eInput, setEInput] = useState("17");
  const [cipherInput, setCipherInput] = useState("2557");
  const [maxDivisorInput, setMaxDivisorInput] = useState("100000");
  const result = useMemo(() => factorTrialRows(nInput, maxDivisorInput), [nInput, maxDivisorInput]);
  const e = useMemo(() => parseBigInt(eInput, 17n), [eInput]);
  const cipher = useMemo(() => parseBigInt(cipherInput, 0n), [cipherInput]);
  const privateKey = useMemo(() => result.factor && result.cofactor ? rsaPrivateFromFactors(result.factor, result.cofactor, e) : null, [result.factor, result.cofactor, e]);
  const plaintext = privateKey?.d ? modPow(cipher, privateKey.d, result.n) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Factorization Demo" category="Cryptanalysis and Attacks" status="Educational">
        Factor a small RSA modulus by trial division, derive phi(n), compute the private exponent, and decrypt a toy ciphertext.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Public RSA values">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Modulus n"><input className="field font-mono" value={nInput} onChange={(event) => setNInput(event.target.value)} /></Field>
            <Field label="Public exponent e"><input className="field font-mono" value={eInput} onChange={(event) => setEInput(event.target.value)} /></Field>
            <Field label="Ciphertext c"><input className="field font-mono" value={cipherInput} onChange={(event) => setCipherInput(event.target.value)} /></Field>
            <Field label="Max trial divisor"><input className="field font-mono" value={maxDivisorInput} onChange={(event) => setMaxDivisorInput(event.target.value)} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => { setNInput("3233"); setEInput("17"); setCipherInput("2557"); setMaxDivisorInput("100000"); }}>RSA textbook sample</button>
            <button className="btn" type="button" onClick={() => { setNInput("11413"); setEInput("17"); setCipherInput("2790"); setMaxDivisorInput("100000"); }}>Second sample</button>
          </div>
        </Card>

        <Card title="Recovered private data">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={result.factor ? "error" : "success"}>{result.factor ? "Factor found" : "No factor in range"}</StatusPill>
              <StatusPill tone="info">{result.rows.length} divisions</StatusPill>
            </div>
            <ValueRow label="p" value={result.factor?.toString() ?? "not found"} />
            <ValueRow label="q" value={result.cofactor?.toString() ?? "not found"} />
            <ValueRow label="phi(n)" value={privateKey?.phi.toString() ?? "not available"} />
            <ValueRow label="private exponent d" value={privateKey?.d?.toString() ?? "not available"} />
            <ValueRow label="decrypted m = c^d mod n" value={plaintext?.toString() ?? "not available"} />
            <WarningBadge>Real RSA moduli are far beyond trial division. This page demonstrates the full break only for deliberately tiny educational keys.</WarningBadge>
          </div>
        </Card>
      </div>

      <Card title="Trial division trace">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Divisor</th><th className="p-2 text-left">n mod divisor</th><th className="p-2 text-left">Result</th></tr></thead>
            <tbody>
              {result.rows.slice(0, 300).map((row) => (
                <tr key={row.divisor.toString()} className={`border-t border-slate-100 ${row.divides ? "bg-emerald-50" : ""}`}>
                  <td className="p-2 font-mono">{row.divisor.toString()}</td>
                  <td className="p-2 font-mono">{row.remainder.toString()}</td>
                  <td className="p-2">{row.divides ? "factor" : "continue"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
