import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { ErrorSummary } from "../../../../components/common/ErrorSummary";
import { modPow, modPowTrace } from "../../../../lib/cryptoDemos";
import { parseBigIntStrict } from "../../../../lib/bigintValidation";

export default function RSAEncryptionPage() {
  const [message, setMessage] = useState("42");
  const [e, setE] = useState("17");
  const [n, setN] = useState("3233");
  const result = useMemo(() => {
    const parsed = [parseBigIntStrict(message, "Message", { min: 0n }), parseBigIntStrict(e, "Public exponent", { min: 1n }), parseBigIntStrict(n, "Modulus", { min: 2n })];
    const errors = parsed.filter((item) => !item.ok).map((item, index) => ({ field: ["Message", "Exponent", "Modulus"][index], message: item.error, severity: "error" as const }));
    if (errors.length) return { ok: false as const, error: "Invalid integer input", errors };
    const [mValue, eValue, nValue] = parsed.map((item) => item.value);
    if (mValue >= nValue) errors.push({ field: "Message", message: "Raw RSA requires m < n.", severity: "error" as const });
    if (errors.length) return { ok: false as const, error: "Invalid RSA values", errors };
    return { ok: true as const, mValue, eValue, nValue, cipher: modPow(mValue, eValue, nValue), trace: modPowTrace(mValue, eValue, nValue) };
  }, [message, e, n]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Encryption" category="Public Key Cryptography" status="Educational">Compute real small-number RSA encryption as c = m^e mod n and inspect square-and-multiply.</PageHeader>
      {!result.ok && <ErrorSummary issues={result.errors} />}
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Public-key inputs">
          <div className="grid gap-4">
            <Field label="Message integer m"><input className="field font-mono" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Public exponent e"><input className="field font-mono" value={e} onChange={(event) => setE(event.target.value)} /></Field>
            <Field label="Modulus n"><input className="field font-mono" value={n} onChange={(event) => setN(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Ciphertext output">
          {result.ok ? (
            <div className="grid gap-3 md:grid-cols-2">
              <ValueRow label="Formula" value={`${result.mValue}^${result.eValue} mod ${result.nValue}`} />
              <ValueRow label="Cipher integer c" value={result.cipher.toString()} />
              <ValueRow label="Message < n" value={String(result.mValue < result.nValue)} />
              <ValueRow label="Exponent bits" value={result.eValue.toString(2)} />
            </div>
          ) : <WarningBadge>{result.error}</WarningBadge>}
        </Card>
      </div>
      {result.ok && (
        <Card title="Encryption flow before output">
          <div className="grid gap-3 text-sm md:grid-cols-4">
            <div className="rounded-md border-2 border-cyan-300 bg-cyan-50 p-3"><p className="text-xs font-semibold uppercase text-cyan-700">Plaintext</p><p className="mt-1 font-mono text-lg font-bold">{result.mValue.toString()}</p></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">Public key</p><p className="mt-1 font-mono">e={result.eValue}<br />n={result.nValue}</p></div>
            <div className="rounded-md border border-slate-200 bg-white p-3"><p className="text-xs font-semibold uppercase text-slate-500">Formula</p><p className="mt-1 font-mono">m^e mod n</p></div>
            <div className="rounded-md border-2 border-emerald-300 bg-emerald-50 p-3"><p className="text-xs font-semibold uppercase text-emerald-700">Ciphertext</p><p className="mt-1 font-mono text-lg font-bold">{result.cipher.toString()}</p></div>
          </div>
        </Card>
      )}
      {result.ok && (
        <Card title="Square-and-multiply trace">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">Exponent bit</th><th className="p-2 text-left">Current base</th><th className="p-2 text-left">Result after multiply-if-1</th></tr></thead>
              <tbody>{result.trace.map((row, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{index + 1}</td><td className="p-2 font-mono">{row.bit}</td><td className="p-2 font-mono">{row.base}</td><td className="p-2 font-mono">{row.result}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}
      <Card title="Warnings and export">
        <WarningBadge>This is real modular arithmetic, but it is educational raw RSA. Real RSA encryption must use padding such as OAEP and large vetted keys.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="RSA encryption" data={{ message, e, n, result }} /></div>
      </Card>
    </div>
  );
}
