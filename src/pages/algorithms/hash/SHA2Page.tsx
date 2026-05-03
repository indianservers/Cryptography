import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex } from "../../../lib/cryptoDemos";

type Variant = "SHA-256" | "SHA-384" | "SHA-512";

const VARIANTS: Variant[] = ["SHA-256", "SHA-384", "SHA-512"];

const VARIANT_INFO: Record<Variant, { bits: number; blockBits: number; wordBits: number; rounds: number }> = {
  "SHA-256": { bits: 256, blockBits: 512, wordBits: 32, rounds: 64 },
  "SHA-384": { bits: 384, blockBits: 1024, wordBits: 64, rounds: 80 },
  "SHA-512": { bits: 512, blockBits: 1024, wordBits: 64, rounds: 80 },
};

export default function SHA2Page() {
  const [message, setMessage] = useState("The quick brown fox jumps over the lazy dog");
  const [variant, setVariant] = useState<Variant>("SHA-256");
  const [digest, setDigest] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setDigest("Computing...");
    setError("");
    digestHex(variant, message)
      .then((result) => { setDigest(result); setError(""); })
      .catch((err) => { setDigest(""); setError(err instanceof Error ? err.message : "Digest failed"); });
  }, [message, variant]);

  const info = VARIANT_INFO[variant];

  return (
    <div className="space-y-6">
      <PageHeader title="SHA-2 Family" category="Hash Functions" status="Modern">
        SHA-2 is the current standard hash family. Real digests are computed in your browser using the Web Crypto API. No server call is needed.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Message and variant">
          <Field label="Message">
            <textarea className="field min-h-28" value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
          <Field label="Variant">
            <select className="field mt-1" value={variant} onChange={(e) => setVariant(e.target.value as Variant)}>
              {VARIANTS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </Field>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setMessage("The quick brown fox jumps over the lazy dog")}>Sample</button>
            <button className="btn" onClick={() => setMessage("")}>Empty message</button>
          </div>
        </Card>
        <Card title="Digest output">
          {error ? (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : (
            <div className="space-y-3">
              <ValueRow label={`${variant} digest (hex)`} value={digest} />
              <ValueRow label="Digest length" value={`${info.bits} bits (${info.bits / 8} bytes, ${info.bits / 4} hex chars)`} />
            </div>
          )}
        </Card>
      </div>
      <Card title="SHA-2 family comparison">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-2 text-left">Variant</th>
                <th className="p-2 text-left">Digest bits</th>
                <th className="p-2 text-left">Block size</th>
                <th className="p-2 text-left">Word size</th>
                <th className="p-2 text-left">Rounds</th>
              </tr>
            </thead>
            <tbody>
              {VARIANTS.map((v) => {
                const row = VARIANT_INFO[v];
                return (
                  <tr key={v} className={`border-t border-slate-100 ${v === variant ? "bg-cyan-50 font-semibold" : ""}`}>
                    <td className="p-2 font-mono">{v}</td>
                    <td className="p-2">{row.bits}</td>
                    <td className="p-2">{row.blockBits}-bit</td>
                    <td className="p-2">{row.wordBits}-bit</td>
                    <td className="p-2">{row.rounds}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          SHA-256 and SHA-512 are primary variants. SHA-384 is SHA-512 truncated with a different IV, used when 256-bit output is insufficient but 512 bits would waste space.
        </p>
      </Card>
      <WarningBadge>SHA-256 is the minimum recommended digest length for new systems. SHA-384/512 provide larger collision resistance margins and are preferred in long-term security contexts such as certificate chains.</WarningBadge>
    </div>
  );
}
