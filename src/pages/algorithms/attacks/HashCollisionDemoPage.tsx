import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex } from "../../../lib/cryptoDemos";

interface CollisionResult {
  left: string;
  right: string;
  digest: string;
  attempts: number;
}

async function findCollision(prefix: string, bits: number, maxAttempts: number) {
  const hexChars = Math.max(1, Math.floor(bits / 4));
  const seen = new Map<string, string>();
  for (let index = 0; index < maxAttempts; index += 1) {
    const message = `${prefix}-${index}`;
    const digest = (await digestHex("SHA-256", message)).slice(0, hexChars);
    const previous = seen.get(digest);
    if (previous && previous !== message) return { left: previous, right: message, digest, attempts: index + 1 };
    seen.set(digest, message);
    if (index % 250 === 0) await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
  return null;
}

export default function HashCollisionDemoPage() {
  const [prefix, setPrefix] = useState("message");
  const [bits, setBits] = useState(16);
  const [maxAttempts, setMaxAttempts] = useState(5000);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<CollisionResult | null>(null);
  const [status, setStatus] = useState("Ready.");
  const birthdayEstimate = useMemo(() => Math.ceil(Math.sqrt(2 ** bits)), [bits]);

  useEffect(() => {
    let active = true;
    setRunning(true);
    setStatus("Searching truncated SHA-256 space...");
    findCollision(prefix, bits, maxAttempts).then((value) => {
      if (!active) return;
      setResult(value);
      setStatus(value ? `Collision found after ${value.attempts.toLocaleString()} attempts.` : `No collision in ${maxAttempts.toLocaleString()} attempts.`);
      setRunning(false);
    });
    return () => { active = false; };
  }, [prefix, bits, maxAttempts]);

  return (
    <div className="space-y-6">
      <PageHeader title="Hash Collision Demo" category="Cryptanalysis and Attacks" status="Educational">
        Search for an actual collision in truncated SHA-256 output. Full SHA-256 remains out of reach; the digest is shortened so the birthday effect is visible.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Collision search">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Message prefix"><input className="field font-mono" value={prefix} onChange={(event) => setPrefix(event.target.value)} /></Field>
            <Field label="Toy digest bits"><input className="field font-mono" type="number" min={8} max={32} step={4} value={bits} onChange={(event) => setBits(Number(event.target.value))} /></Field>
            <Field label="Max attempts"><input className="field font-mono" type="number" min={100} max={100000} value={maxAttempts} onChange={(event) => setMaxAttempts(Number(event.target.value))} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill tone={running ? "info" : result ? "success" : "warning"}>{status}</StatusPill>
            <StatusPill tone="info">Birthday estimate: about {birthdayEstimate.toLocaleString()} tries</StatusPill>
          </div>
        </Card>

        <Card title="Collision result">
          <div className="grid gap-3">
            <ValueRow label="Message A" value={result?.left ?? "not found"} />
            <ValueRow label="Message B" value={result?.right ?? "not found"} />
            <ValueRow label={`Shared ${bits}-bit digest prefix`} value={result?.digest ?? "not found"} />
            <WarningBadge>This page does not break full SHA-256. It demonstrates why short hash outputs collide quickly.</WarningBadge>
          </div>
        </Card>
      </div>
    </div>
  );
}
