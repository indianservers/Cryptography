import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { ErrorSummary } from "../../../../components/common/ErrorSummary";
import { modPow, modPowTrace } from "../../../../lib/cryptoDemos";
import { parseBigIntStrict } from "../../../../lib/bigintValidation";

export default function RSADecryptionPage() {
  const [cipher, setCipher] = useState("2557");
  const [d, setD] = useState("2753");
  const [n, setN] = useState("3233");
  const result = useMemo(() => {
    const parsed = [parseBigIntStrict(cipher, "Cipher", { min: 0n }), parseBigIntStrict(d, "Private exponent", { min: 1n }), parseBigIntStrict(n, "Modulus", { min: 2n })];
    const errors = parsed.filter((item) => !item.ok).map((item, index) => ({ field: ["Cipher", "Private exponent", "Modulus"][index], message: item.error, severity: "error" as const }));
    if (errors.length) return { ok: false as const, error: "Invalid integer input", errors };
    const [cValue, dValue, nValue] = parsed.map((item) => item.value);
    if (cValue >= nValue) errors.push({ field: "Cipher", message: "Raw RSA requires c < n.", severity: "error" as const });
    if (errors.length) return { ok: false as const, error: "Invalid RSA values", errors };
    return { ok: true as const, cValue, dValue, nValue, message: modPow(cValue, dValue, nValue), trace: modPowTrace(cValue, dValue, nValue) };
  }, [cipher, d, n]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Decryption" category="Public Key Cryptography" status="Educational">Recover a small educational RSA message as m = c^d mod n and follow the private exponent trace.</PageHeader>
      {!result.ok && <ErrorSummary issues={result.errors} />}
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Private-key inputs">
          <div className="grid gap-4">
            <Field label="Cipher integer c"><input className="field font-mono" value={cipher} onChange={(event) => setCipher(event.target.value)} /></Field>
            <Field label="Private exponent d"><input className="field font-mono" value={d} onChange={(event) => setD(event.target.value)} /></Field>
            <Field label="Modulus n"><input className="field font-mono" value={n} onChange={(event) => setN(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Recovered plaintext">
          {result.ok ? (
            <div className="grid gap-3 md:grid-cols-2">
              <ValueRow label="Formula" value={`${result.cValue}^${result.dValue} mod ${result.nValue}`} />
              <ValueRow label="Recovered integer m" value={result.message.toString()} />
              <ValueRow label="Private exponent bits" value={result.dValue.toString(2)} />
              <ValueRow label="Trace length" value={`${result.trace.length} multiply/square rows`} />
            </div>
          ) : <WarningBadge>{result.error}</WarningBadge>}
        </Card>
      </div>
      {result.ok && (
        <Card title="Decryption flow with encryption result kept visible">
          <div className="grid gap-3 text-sm md:grid-cols-4">
            <div className="rounded-md border-2 border-emerald-300 bg-emerald-50 p-3"><p className="text-xs font-semibold uppercase text-emerald-700">Ciphertext from encryption</p><p className="mt-1 font-mono text-lg font-bold">{result.cValue.toString()}</p></div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3"><p className="text-xs font-semibold uppercase text-slate-500">Private key</p><p className="mt-1 font-mono">d={result.dValue}<br />n={result.nValue}</p></div>
            <div className="rounded-md border border-slate-200 bg-white p-3"><p className="text-xs font-semibold uppercase text-slate-500">Formula</p><p className="mt-1 font-mono">c^d mod n</p></div>
            <div className="rounded-md border-2 border-cyan-300 bg-cyan-50 p-3"><p className="text-xs font-semibold uppercase text-cyan-700">Recovered message</p><p className="mt-1 font-mono text-lg font-bold">{result.message.toString()}</p></div>
          </div>
        </Card>
      )}
      {result.ok && (
        <Card title="Private exponentiation trace">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">d bit</th><th className="p-2 text-left">Squared base</th><th className="p-2 text-left">Accumulator</th></tr></thead>
              <tbody>{result.trace.map((row, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{index + 1}</td><td className="p-2 font-mono">{row.bit}</td><td className="p-2 font-mono">{row.base}</td><td className="p-2 font-mono">{row.result}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}
      <Card title="Warnings and export">
        <WarningBadge>Real RSA private-key operations require side-channel protection and padding checks. This page intentionally uses small visible numbers for learning.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="RSA decryption" data={{ cipher, d, n, result }} /></div>
      </Card>
    </div>
  );
}
