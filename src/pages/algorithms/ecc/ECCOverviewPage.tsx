import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { modInv } from "../../../lib/cryptoDemos";

type Point = { x: bigint; y: bigint } | null;
const mod = (value: bigint, p: bigint) => ((value % p) + p) % p;
const pointLabel = (p: Point) => p ? `(${p.x}, ${p.y})` : "point at infinity";

function addPoints(P: Point, Q: Point, a: bigint, prime: bigint): Point {
  if (!P) return Q;
  if (!Q) return P;
  if (P.x === Q.x && mod(P.y + Q.y, prime) === 0n) return null;
  const numerator = P.x === Q.x && P.y === Q.y ? 3n * P.x * P.x + a : Q.y - P.y;
  const denominator = P.x === Q.x && P.y === Q.y ? 2n * P.y : Q.x - P.x;
  const inv = modInv(mod(denominator, prime), prime);
  if (inv === null) return null;
  const slope = mod(numerator * inv, prime);
  const x = mod(slope * slope - P.x - Q.x, prime);
  const y = mod(slope * (P.x - x) - P.y, prime);
  return { x, y };
}

function scalarMult(k: bigint, P: Point, a: bigint, prime: bigint) {
  let result: Point = null;
  let addend = P;
  let n = k;
  while (n > 0n) {
    if (n & 1n) result = addPoints(result, addend, a, prime);
    addend = addPoints(addend, addend, a, prime);
    n >>= 1n;
  }
  return result;
}

export default function ECCOverviewPage() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const [p, setP] = useState("97");
  const [x, setX] = useState("3");
  const [y, setY] = useState("6");
  const [k, setK] = useState("7");
  const values = useMemo(() => {
    const aa = BigInt(a || "0"), bb = BigInt(b || "0"), prime = BigInt(p || "97");
    const P: Point = { x: BigInt(x || "0"), y: BigInt(y || "0") };
    return { aa, bb, prime, P, doubled: addPoints(P, P, aa, prime), multiplied: scalarMult(BigInt(k || "1"), P, aa, prime) };
  }, [a, b, k, p, x, y]);

  return (
    <div className="space-y-6">
      <PageHeader title="ECC Overview" category="Elliptic Curve Cryptography" status="Modern">A toy finite-field curve explorer for point doubling, point addition, scalar multiplication, and ECC/RSA comparison.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Curve and base point">
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="a"><input className="field font-mono" value={a} onChange={(event) => setA(event.target.value)} /></Field>
            <Field label="b"><input className="field font-mono" value={b} onChange={(event) => setB(event.target.value)} /></Field>
            <Field label="field prime p"><input className="field font-mono" value={p} onChange={(event) => setP(event.target.value)} /></Field>
            <Field label="Point x"><input className="field font-mono" value={x} onChange={(event) => setX(event.target.value)} /></Field>
            <Field label="Point y"><input className="field font-mono" value={y} onChange={(event) => setY(event.target.value)} /></Field>
            <Field label="Scalar k"><input className="field font-mono" value={k} onChange={(event) => setK(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Group operations">
          <div className="space-y-3">
            <ValueRow label="Curve equation" value={`y^2 = x^3 + ${values.aa}x + ${values.bb} mod ${values.prime}`} />
            <ValueRow label="2P" value={pointLabel(values.doubled)} />
            <ValueRow label={`${k}P`} value={pointLabel(values.multiplied)} />
          </div>
        </Card>
      </div>
      <Card title="Why ECC keys are compact">
        <table className="w-full text-sm"><tbody><tr className="border-b border-slate-100"><td className="p-2 font-semibold">RSA</td><td className="p-2">Security comes from integer factorization difficulty and needs larger keys.</td></tr><tr><td className="p-2 font-semibold">ECC</td><td className="p-2">Security comes from elliptic-curve discrete logarithms and uses smaller public keys for similar strength.</td></tr></tbody></table>
      </Card>
      <WarningBadge>Toy curves are for formulas only. Production systems must use vetted named curves and validate public points.</WarningBadge>
    </div>
  );
}
