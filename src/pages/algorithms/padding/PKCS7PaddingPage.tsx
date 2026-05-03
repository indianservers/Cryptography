import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";

function pkcs7Pad(text: string, blockSize: number): { padded: Uint8Array; originalLen: number } {
  const bytes = new TextEncoder().encode(text);
  const padLen = blockSize - (bytes.length % blockSize);
  const padded = new Uint8Array(bytes.length + padLen);
  padded.set(bytes);
  padded.fill(padLen, bytes.length);
  return { padded, originalLen: bytes.length };
}

export default function PKCS7PaddingPage() {
  const [text, setText] = useState("Hello World");
  const [blockSize, setBlockSize] = useState(16);

  const { padded, originalLen } = useMemo(() => pkcs7Pad(text, blockSize), [text, blockSize]);

  const padLen = padded.length - originalLen;

  const blocks = useMemo(() => {
    const result: string[][] = [];
    for (let i = 0; i < padded.length; i += blockSize) {
      result.push(Array.from(padded.slice(i, i + blockSize), (b) => b.toString(16).padStart(2, "0")));
    }
    return result;
  }, [padded, blockSize]);

  return (
    <div className="space-y-6">
      <PageHeader title="PKCS#7 Padding" category="Padding Schemes" status="Educational">
        Appends N bytes each set to the value N so the data length aligns to the block boundary. Padding bytes are highlighted in amber below.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input and block size">
          <Field label="Input text">
            <textarea className="field min-h-24" value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="mt-3">
            <label className="text-sm font-medium">
              Block size: {blockSize} bytes
              <input
                type="range" min="8" max="32" step="8" value={blockSize}
                onChange={(e) => setBlockSize(Number(e.target.value))}
                className="ml-2 w-36 align-middle"
              />
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setText("Hello World")}>Sample</button>
            <button className="btn" onClick={() => setText("A".repeat(blockSize))}>Aligned input</button>
            <button className="btn" onClick={() => setText("")}>Clear</button>
          </div>
        </Card>
        <Card title="Padding analysis">
          <div className="space-y-3">
            <ValueRow label="Input length" value={`${originalLen} bytes`} />
            <ValueRow label="Padding value and length" value={`0x${padLen.toString(16).padStart(2, "0")} x ${padLen} bytes`} />
            <ValueRow label="Padded total" value={`${padded.length} bytes (${padded.length / blockSize} full block${padded.length / blockSize !== 1 ? "s" : ""})`} />
          </div>
        </Card>
      </div>
      <Card title="Block grid: amber bytes are padding">
        <div className="space-y-4">
          {blocks.map((block, blockIndex) => (
            <div key={blockIndex}>
              <div className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Block {blockIndex + 1}</div>
              <div className="flex flex-wrap gap-1">
                {block.map((byte, byteIndex) => {
                  const globalIndex = blockIndex * blockSize + byteIndex;
                  const isPad = globalIndex >= originalLen;
                  return (
                    <span
                      key={byteIndex}
                      title={isPad ? `Padding byte: 0x${byte} (= ${parseInt(byte, 16)})` : `Data byte ${globalIndex}: 0x${byte}`}
                      className={`rounded px-2 py-1 font-mono text-xs ${
                        isPad
                          ? "bg-amber-200 text-amber-900 font-bold ring-1 ring-amber-400"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {byte}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-500">
            <span className="rounded bg-amber-200 px-1 font-mono text-amber-900">amber</span> = PKCS#7 padding bytes
            &nbsp;&nbsp;
            <span className="rounded bg-slate-100 px-1 font-mono text-slate-700">grey</span> = data bytes
          </p>
        </div>
      </Card>
      <WarningBadge>Even an input that exactly fills a block receives a full extra padding block (all bytes set to the block size). This ensures padding is always present and unambiguous to remove on decryption.</WarningBadge>
    </div>
  );
}
