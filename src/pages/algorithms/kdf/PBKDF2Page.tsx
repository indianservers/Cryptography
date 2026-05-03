import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { pbkdf2Hex } from "../../../lib/cryptoDemos";

export default function PBKDF2Page() {
  const [password, setPassword] = useState("swordfish");
  const [salt, setSalt] = useState("unique per user salt");
  const [iterations, setIterations] = useState(120000);
  const [hash, setHash] = useState("SHA-256");
  const [length, setLength] = useState(256);
  const [derived, setDerived] = useState("");
  const [ms, setMs] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const start = performance.now();
      const output = await pbkdf2Hex(password, salt, iterations, hash, length);
      const elapsed = Math.round(performance.now() - start);
      if (!cancelled) {
        setDerived(output);
        setMs(elapsed);
      }
    }
    run().catch((error) => setDerived(error instanceof Error ? error.message : "PBKDF2 failed"));
    return () => { cancelled = true; };
  }, [hash, iterations, length, password, salt]);

  return (
    <div className="space-y-6">
      <PageHeader title="PBKDF2" category="Key Derivation Functions" status="Modern">Derive password-based key material locally with Web Crypto PBKDF2 and inspect cost, salt, hash, and output length.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Derivation settings">
          <div className="grid gap-4">
            <Field label="Password"><input className="field" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
            <Field label="Salt"><input className="field font-mono" value={salt} onChange={(event) => setSalt(event.target.value)} /></Field>
            <Field label="Iteration count"><input className="field" type="number" min="1" value={iterations} onChange={(event) => setIterations(Number(event.target.value))} /></Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Hash"><select className="field" value={hash} onChange={(event) => setHash(event.target.value)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option><option>SHA-1</option></select></Field>
              <Field label="Derived key length bits"><input className="field" type="number" min="128" step="64" value={length} onChange={(event) => setLength(Number(event.target.value))} /></Field>
            </div>
          </div>
        </Card>
        <Card title="Derived key output">
          <div className="space-y-3">
            <ValueRow label="Derived key hex" value={derived} />
            <ValueRow label="Local timing" value={`${ms} ms`} />
          </div>
        </Card>
      </div>
      <Card title="Timing chart">
        <div className="h-4 rounded bg-slate-100"><div className="h-4 rounded bg-cyan-500" style={{ width: `${Math.min(100, ms / 10)}%` }} /></div>
        <p className="mt-3 text-sm text-slate-600">More iterations increase attacker cost and user wait time. Tune on your target devices.</p>
      </Card>
      <WarningBadge>PBKDF2 needs a unique random salt per password. For new password storage, memory-hard KDFs such as Argon2id are generally preferred where available.</WarningBadge>
    </div>
  );
}
