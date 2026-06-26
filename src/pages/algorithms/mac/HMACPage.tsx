import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex, hmacHex } from "../../../lib/cryptoDemos";

export default function HMACPage() {
  const [message, setMessage] = useState("authenticated browser message");
  const [key, setKey] = useState("correct horse battery staple");
  const [hash, setHash] = useState("SHA-256");
  const [inner, setInner] = useState("");
  const [outer, setOuter] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const innerHash = await digestHex(hash, `ipad:${key}:${message}`);
      const outerHash = await digestHex(hash, `opad:${key}:${innerHash}`);
      const realTag = await hmacHex(hash, key, message);
      if (!cancelled) {
        setInner(innerHash);
        setOuter(outerHash);
        setTag(realTag);
      }
    }
    run().catch((error) => setTag(error instanceof Error ? error.message : "HMAC failed"));
    return () => { cancelled = true; };
  }, [hash, key, message]);

  return (
    <div className="space-y-6">
      <PageHeader title="HMAC" category="MAC Algorithms" status="Modern">A real browser Web Crypto HMAC tag plus an educational ipad/opad trace. HMAC authenticates messages with a shared secret key.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Message, secret key, and hash">
          <div className="grid gap-4">
            <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Secret key"><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <Field label="Hash selector"><select className="field" value={hash} onChange={(event) => setHash(event.target.value)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option><option>SHA-1</option></select></Field>
          </div>
        </Card>
        <Card title="Final tag">
          <ValueRow label={`${hash} HMAC tag`} value={tag} />
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Inner hash">
          <div className="rounded-md border border-sky-200 bg-sky-50 p-3">
            <ValueRow label="H((K xor ipad) || message) concept" value={inner} />
          </div>
        </Card>
        <Card title="Outer hash">
          <div className="rounded-md border border-violet-200 bg-violet-50 p-3">
            <ValueRow label="H((K xor opad) || inner)" value={outer} />
          </div>
        </Card>
      </div>
      <Card title="HMAC block diagram">
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ["Key", "border-slate-200 bg-slate-50"],
            ["K xor ipad", "border-sky-200 bg-sky-50 text-sky-950"],
            ["Inner hash", "border-sky-300 bg-sky-100 text-sky-950"],
            ["K xor opad", "border-violet-200 bg-violet-50 text-violet-950"],
            ["Final tag", "border-violet-300 bg-violet-100 text-violet-950"],
          ].map(([label, className], index) => (
            <div key={label} className={`rounded-md border p-3 text-center text-sm font-semibold ${className}`}>
              <div className="font-mono text-xs">#{index + 1}</div>
              {label}
            </div>
          ))}
        </div>
      </Card>
      <WarningBadge>Keep the HMAC key secret and compare tags in constant time in production systems.</WarningBadge>
    </div>
  );
}
