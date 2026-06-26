import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { modPow, modPowTrace } from "../../../../lib/cryptoDemos";

const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

export default function RSASignaturePage() {
  const [message, setMessage] = useState("sign this browser-only message");
  const [hashName, setHashName] = useState("SHA-256");
  const [d, setD] = useState("2753");
  const [e, setE] = useState("17");
  const [n, setN] = useState("3233");
  const [digest, setDigest] = useState("");

  useEffect(() => {
    let active = true;
    crypto.subtle.digest(hashName, new TextEncoder().encode(message)).then((value) => {
      if (active) setDigest(hex(value));
    });
    return () => { active = false; };
  }, [message, hashName]);

  const result = useMemo(() => {
    try {
      const hashInteger = BigInt(`0x${(digest || "00").slice(0, 12)}`);
      const dValue = BigInt(d);
      const eValue = BigInt(e);
      const nValue = BigInt(n);
      const signature = modPow(hashInteger, dValue, nValue);
      const verifiedHash = modPow(signature, eValue, nValue);
      return { ok: true as const, hashInteger, dValue, eValue, nValue, signature, verifiedHash, valid: verifiedHash === hashInteger % nValue, trace: modPowTrace(hashInteger, dValue, nValue) };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Invalid signature input" };
    }
  }, [digest, d, e, n]);

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Signature" category="Public Key Cryptography" status="Modern">Hash a message, sign the hash integer with d, then verify by raising the signature to e modulo n.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Signature inputs">
          <div className="grid gap-4">
            <Field label="Message"><textarea className="field min-h-24" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Hash"><select className="field" value={hashName} onChange={(event) => setHashName(event.target.value)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></Field>
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="d"><input className="field font-mono" value={d} onChange={(event) => setD(event.target.value)} /></Field>
              <Field label="e"><input className="field font-mono" value={e} onChange={(event) => setE(event.target.value)} /></Field>
              <Field label="n"><input className="field font-mono" value={n} onChange={(event) => setN(event.target.value)} /></Field>
            </div>
          </div>
        </Card>
        <Card title="Signature and verify result">
          {result.ok ? (
            <div className="grid gap-3 md:grid-cols-2">
              <ValueRow label="Digest" value={digest} />
              <ValueRow label="Hash integer preview" value={result.hashInteger.toString()} />
              <ValueRow label="Signature s = h^d mod n" value={result.signature.toString()} />
              <ValueRow label="Verify s^e mod n" value={result.verifiedHash.toString()} />
              <ValueRow label="Valid for toy modulus" value={String(result.valid)} />
            </div>
          ) : <WarningBadge>{result.error}</WarningBadge>}
        </Card>
      </div>
      {result.ok && (
        <Card title="Signing and verification side by side">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-md border border-violet-200 bg-violet-50 p-4 text-violet-950">
              <div className="text-xs font-semibold uppercase">Signer uses private key</div>
              <div className="mt-2 font-mono text-sm">hash {"->"} h={result.hashInteger.toString()} {"->"} h^d mod n = {result.signature.toString()}</div>
              <p className="mt-2 text-sm">The signature is made from the digest, not from the raw message text.</p>
            </div>
            <div className="hidden items-center px-2 text-2xl font-semibold text-slate-400 md:flex">{"->"}</div>
            <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sky-950">
              <div className="text-xs font-semibold uppercase">Verifier uses public key</div>
              <div className="mt-2 font-mono text-sm">s^e mod n = {result.verifiedHash.toString()}</div>
              <p className="mt-2 text-sm">Verification checks whether the public-key result matches the message digest modulo n.</p>
            </div>
          </div>
        </Card>
      )}
      <Card title="Where the hash is created">
        <div className="grid gap-2 md:grid-cols-4">
          {["Message", `${hashName} digest`, "Sign digest", "Verify digest"].map((step, index) => (
            <div key={step} className={`rounded-md border p-3 text-sm ${index === 1 ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
              <div className="font-mono text-xs">step {index + 1}</div>
              <div className="font-semibold">{step}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 break-all rounded-md border border-amber-200 bg-amber-50 p-3 font-mono text-xs text-amber-950">{digest}</div>
      </Card>
      {result.ok && (
        <Card title="Signing exponentiation trace">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">d bit</th><th className="p-2 text-left">Base</th><th className="p-2 text-left">Accumulator</th></tr></thead>
              <tbody>{result.trace.map((row, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{index + 1}</td><td className="p-2 font-mono">{row.bit}</td><td className="p-2 font-mono">{row.base}</td><td className="p-2 font-mono">{row.result}</td></tr>)}</tbody>
            </table>
          </div>
        </Card>
      )}
      <Card title="PSS and warnings">
        <WarningBadge>This page shows real hash and modular exponentiation with small visible numbers. Production RSA signatures should use RSA-PSS through vetted APIs and large keys.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="RSA signature" data={{ message, hashName, d, e, n, digest, result }} /></div>
      </Card>
    </div>
  );
}
