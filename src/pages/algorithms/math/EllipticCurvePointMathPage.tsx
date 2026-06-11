import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { ecAdd, ecScalarMultiply, isOnCurve, parseBigInt, type CurvePoint } from "../../../lib/appliedMath";

const showPoint = (point: CurvePoint | null) => point ? `(${point.x}, ${point.y})` : "O";

export default function EllipticCurvePointMathPage() {
  const [pInput, setPInput] = useState("17");
  const [aInput, setAInput] = useState("2");
  const [bInput, setBInput] = useState("2");
  const [pxInput, setPxInput] = useState("5");
  const [pyInput, setPyInput] = useState("1");
  const [qxInput, setQxInput] = useState("6");
  const [qyInput, setQyInput] = useState("3");
  const [kInput, setKInput] = useState("7");
  const p = parseBigInt(pInput, 17n);
  const a = parseBigInt(aInput, 2n);
  const b = parseBigInt(bInput, 2n);
  const pointP = { x: parseBigInt(pxInput, 0n), y: parseBigInt(pyInput, 0n) };
  const pointQ = { x: parseBigInt(qxInput, 0n), y: parseBigInt(qyInput, 0n) };
  const k = parseBigInt(kInput, 1n);
  const add = useMemo(() => ecAdd(pointP, pointQ, a, p), [pointP.x, pointP.y, pointQ.x, pointQ.y, a, p]);
  const double = useMemo(() => ecAdd(pointP, pointP, a, p), [pointP.x, pointP.y, a, p]);
  const scalar = useMemo(() => ecScalarMultiply(pointP, k, a, p), [pointP.x, pointP.y, k, a, p]);

  return (
    <div className="space-y-6">
      <PageHeader title="Elliptic Curve Point Arithmetic" category="Applied Mathematics" status="Educational">
        Add, double, and scalar-multiply points on a small curve y^2 = x^3 + ax + b over GF(p). These are the core operations behind ECC.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Curve and points">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="prime p"><input className="field font-mono" value={pInput} onChange={(e) => setPInput(e.target.value)} /></Field>
            <Field label="curve a"><input className="field font-mono" value={aInput} onChange={(e) => setAInput(e.target.value)} /></Field>
            <Field label="curve b"><input className="field font-mono" value={bInput} onChange={(e) => setBInput(e.target.value)} /></Field>
            <Field label="P.x"><input className="field font-mono" value={pxInput} onChange={(e) => setPxInput(e.target.value)} /></Field>
            <Field label="P.y"><input className="field font-mono" value={pyInput} onChange={(e) => setPyInput(e.target.value)} /></Field>
            <Field label="scalar k"><input className="field font-mono" value={kInput} onChange={(e) => setKInput(e.target.value)} /></Field>
            <Field label="Q.x"><input className="field font-mono" value={qxInput} onChange={(e) => setQxInput(e.target.value)} /></Field>
            <Field label="Q.y"><input className="field font-mono" value={qyInput} onChange={(e) => setQyInput(e.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Operations">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={isOnCurve(pointP, a, b, p) ? "success" : "warning"}>P {isOnCurve(pointP, a, b, p) ? "on curve" : "off curve"}</StatusPill>
              <StatusPill tone={isOnCurve(pointQ, a, b, p) ? "success" : "warning"}>Q {isOnCurve(pointQ, a, b, p) ? "on curve" : "off curve"}</StatusPill>
            </div>
            <ValueRow label="P + Q" value={`${showPoint(add.point)}; slope ${add.slope?.toString() ?? "none"}; ${add.note}`} />
            <ValueRow label="2P" value={`${showPoint(double.point)}; slope ${double.slope?.toString() ?? "none"}; ${double.note}`} />
            <ValueRow label="kP" value={showPoint(scalar.point)} />
          </div>
        </Card>
      </div>
      <Card title="Double-and-add scalar trace">
        <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">bit</th><th className="p-2 text-left">result</th><th className="p-2 text-left">addend</th><th className="p-2 text-left">action</th></tr></thead><tbody>{scalar.steps.map((step, index) => <tr key={index} className="border-t border-slate-100"><td className="p-2 font-mono">{step.bit}</td><td className="p-2 font-mono">{step.result}</td><td className="p-2 font-mono">{step.addend}</td><td className="p-2">{step.action}</td></tr>)}</tbody></table></div>
      </Card>
    </div>
  );
}
