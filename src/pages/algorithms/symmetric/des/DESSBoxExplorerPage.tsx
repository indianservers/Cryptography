import { useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { desSBoxes } from "./desTables";

export default function DESSBoxExplorerPage() {
  const [box, setBox] = useState(0);
  const [bits, setBits] = useState("011011");
  const clean = bits.replace(/[^01]/g, "").padEnd(6, "0").slice(0, 6);
  const row = parseInt(clean[0] + clean[5], 2);
  const col = parseInt(clean.slice(1, 5), 2);
  const output = desSBoxes[box][row][col].toString(2).padStart(4, "0");

  return (
    <div className="space-y-6">
      <PageHeader title="DES S-Box Explorer" category="Block Ciphers" status="Educational">Use the real DES S1-S8 tables. A 6-bit input selects a row from the outer bits and a column from the inner four bits.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="S-box selection">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="S-box"><select className="field" value={box} onChange={(event) => setBox(Number(event.target.value))}>{desSBoxes.map((_, index) => <option key={index} value={index}>S{index + 1}</option>)}</select></Field>
            <Field label="6-bit input"><input className="field font-mono" value={bits} onChange={(event) => setBits(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Lookup result">
          <div className="space-y-3">
            <ValueRow label="Row from outer bits" value={`${clean[0]}${clean[5]}₂ = ${row}`} />
            <ValueRow label="Column from inner bits" value={`${clean.slice(1, 5)}₂ = ${col}`} />
            <ValueRow label="4-bit output" value={output} />
          </div>
        </Card>
      </div>
      <Card title={`Real DES S${box + 1} table`}>
        <div className="grid grid-cols-16 gap-1">{desSBoxes[box].flatMap((r, rIndex) => r.map((value, cIndex) => <div key={`${rIndex}-${cIndex}`} className={`rounded px-2 py-2 text-center font-mono text-xs ${rIndex === row && cIndex === col ? "bg-cyan-600 text-white" : rIndex === row || cIndex === col ? "bg-cyan-50 text-cyan-900" : "bg-slate-100"}`}>{value}</div>))}</div>
      </Card>
      <WarningBadge>DES S-boxes are educational here; DES itself is deprecated because the key space is too small.</WarningBadge>
    </div>
  );
}
