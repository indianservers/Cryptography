import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { modInv } from "../../../lib/cryptoDemos";

const mod = (value: bigint, q: bigint) => ((value % q) + q) % q;

export default function ECDSAPage() {
  const [q, setQ] = useState("19");
  const [privateKey, setPrivateKey] = useState("7");
  const [hash, setHash] = useState("11");
  const [nonce, setNonce] = useState("5");
  const [rInput, setRInput] = useState("9");
  const [curveStep, setCurveStep] = useState(1);
  const values = useMemo(() => {
    const order = BigInt(q || "19");
    const d = BigInt(privateKey || "1");
    const z = BigInt(hash || "0");
    const k = BigInt(nonce || "1");
    const r = mod(BigInt(rInput || "1"), order);
    const kinv = modInv(k, order);
    const s = kinv === null ? null : mod(kinv * (z + r * d), order);
    const w = s ? modInv(s, order) : null;
    const u1 = w ? mod(z * w, order) : null;
    const u2 = w ? mod(r * w, order) : null;
    return { order, d, z, k, r, kinv, s, w, u1, u2 };
  }, [hash, nonce, privateKey, q, rInput]);

  return (
    <div className="space-y-6">
      <PageHeader title="ECDSA" category="Elliptic Curve Cryptography" status="Modern">A small-order arithmetic visualizer for ECDSA signature values. It shows nonce use, r/s calculation, and verification scalars without targeting real signatures.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Toy signature inputs">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Curve order q"><input className="field font-mono" value={q} onChange={(event) => setQ(event.target.value)} /></Field>
            <Field label="Private key d"><input className="field font-mono" value={privateKey} onChange={(event) => setPrivateKey(event.target.value)} /></Field>
            <Field label="Message hash z"><input className="field font-mono" value={hash} onChange={(event) => setHash(event.target.value)} /></Field>
            <Field label="Nonce k"><input className="field font-mono" value={nonce} onChange={(event) => setNonce(event.target.value)} /></Field>
            <Field label="r from nonce point x-coordinate"><input className="field font-mono" value={rInput} onChange={(event) => setRInput(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Signature and verify scalars">
          <div className="space-y-3">
            <ValueRow label="r" value={values.r.toString()} />
            <ValueRow label="s = k^-1(z + rd) mod q" value={values.s?.toString() ?? "nonce has no inverse modulo q"} />
            <ValueRow label="u1 = z*s^-1 mod q" value={values.u1?.toString() ?? "n/a"} />
            <ValueRow label="u2 = r*s^-1 mod q" value={values.u2?.toString() ?? "n/a"} />
          </div>
        </Card>
      </div>
      <Card title="Tiny curve motion">
        <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
          <Field label={`Nonce point step: ${curveStep}`}>
            <input type="range" min="1" max={Number(nonce || "1")} value={Math.min(curveStep, Math.max(1, Number(nonce || "1")))} onChange={(event) => setCurveStep(Number(event.target.value))} className="w-full" />
          </Field>
          <div className="relative h-44 rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="absolute left-6 right-6 top-1/2 h-px bg-slate-300" />
            <div className="absolute bottom-6 top-6 left-1/2 w-px bg-slate-300" />
            <div className="absolute h-5 w-5 rounded-full border-2 border-amber-500 bg-amber-100 shadow-sm transition-all" style={{ left: `${12 + ((curveStep * 17) % 76)}%`, top: `${18 + ((curveStep * 29) % 58)}%` }} title="Moving nonce point" />
            <div className="absolute bottom-3 left-4 rounded bg-white/80 px-2 py-1 text-xs font-semibold text-slate-700">kG gives the nonce point; its x-coordinate becomes r.</div>
          </div>
        </div>
      </Card>
      <Card title="Nonce reuse danger">
        <p className="text-sm text-slate-600">The nonce is like a one-time mask for the private key inside the signature equation. If the same nonce is used twice, both signatures contain the same hidden mask. Comparing the two equations can cancel that mask and reveal the private key.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">Signature 1 uses k</div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">Signature 2 reuses k</div>
          <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">Private key d can leak</div>
        </div>
      </Card>
      <WarningBadge>Real ECDSA must use unique unpredictable nonces or deterministic nonce generation. Never paste production private keys into learning tools.</WarningBadge>
    </div>
  );
}
