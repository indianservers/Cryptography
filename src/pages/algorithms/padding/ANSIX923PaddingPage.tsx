import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const hexByte = (value: number) => value.toString(16).padStart(2, "0");

export default function ANSIX923PaddingPage() {
  const [input, setInput] = useState("Pay Bob 100");
  const [blockSize, setBlockSize] = useState(16);
  const result = useMemo(() => {
    const data = Array.from(new TextEncoder().encode(input));
    const rem = data.length % blockSize;
    const padLength = rem === 0 ? blockSize : blockSize - rem;
    const padding = [...Array(Math.max(0, padLength - 1)).fill(0), padLength];
    const padded = [...data, ...padding];
    const blocks = Array.from({ length: Math.ceil(padded.length / blockSize) }, (_, index) => padded.slice(index * blockSize, index * blockSize + blockSize));
    return { data, padLength, padding, padded, blocks };
  }, [input, blockSize]);

  return (
    <div className="space-y-6">
      <PageHeader title="ANSI X9.23 Padding" category="Padding Schemes" status="Educational">Pad a message with zero bytes and store the padding length in the final byte.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Input bytes">
          <div className="grid gap-4">
            <Field label="Text input"><textarea className="field min-h-28" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
            <Field label="Block size"><input className="field font-mono" type="number" min={2} max={64} value={blockSize} onChange={(event) => setBlockSize(Math.max(2, Number(event.target.value)))} /></Field>
          </div>
        </Card>
        <Card title="Padding result">
          <div className="grid gap-3 md:grid-cols-3">
            <ValueRow label="Input length" value={`${result.data.length} bytes`} />
            <ValueRow label="Padding length" value={`${result.padLength} bytes`} />
            <ValueRow label="Final length byte" value={`0x${hexByte(result.padLength)}`} />
          </div>
          <pre className="mt-4 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{result.padded.map(hexByte).join("")}</pre>
        </Card>
      </div>
      <Card title="Block visualization">
        <div className="space-y-4">{result.blocks.map((block, blockIndex) => <div key={blockIndex}><div className="mb-2 text-sm font-semibold">Block {blockIndex + 1}</div><div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(blockSize, 16)}, minmax(0, 1fr))` }}>{block.map((byte, index) => {
          const absolute = blockIndex * blockSize + index;
          const isPadding = absolute >= result.data.length;
          const isLength = absolute === result.padded.length - 1;
          return <div key={index} className={`rounded border p-2 text-center font-mono text-xs ${isLength ? "border-cyan-300 bg-cyan-100 text-cyan-950" : isPadding ? "border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>{hexByte(byte)}</div>;
        })}</div></div>)}</div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>If input already aligns to the block size, ANSI X9.23 adds a full extra padding block so unpadding is unambiguous.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="ANSI X9.23 padding" data={result} /></div>
      </Card>
    </div>
  );
}
