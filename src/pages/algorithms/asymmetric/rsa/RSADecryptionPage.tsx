import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { modPow, modPowTrace } from "../../../../lib/cryptoDemos";

export default function RSADecryptionPage() {
  const [cipher, setCipher] = useState("2557");
  const [d, setD] = useState("2753");
  const [n, setN] = useState("3233");
  const result = useMemo(() => {
    try {
      const cValue = BigInt(cipher);
      const dValue = BigInt(d);
      const nValue = BigInt(n);
      return { ok: true as const, cValue, dValue, nValue, message: modPow(cValue, dValue, nValue), trace: modPowTrace(cValue, dValue, nValue) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Invalid integer input" };
    }
  }, [cipher, d, n]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Decryption" category="Public Key Cryptography" status="Educational">Recover a small educational RSA message as m = c^d mod n and follow the private exponent trace.</PageHeader>
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
