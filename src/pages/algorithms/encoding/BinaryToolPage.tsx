import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { textToBinary } from "../../../lib/format";

function binaryToText(binary: string): string {
  try {
    const clean = binary.replace(/\s+/g, "");
    if (clean.length % 8 !== 0) return `Length ${clean.length} is not a multiple of 8 bits`;
    if (!/^[01]+$/.test(clean)) return "Input contains characters other than 0 and 1";
    const bytes = clean.match(/.{8}/g)!.map((b) => parseInt(b, 2));
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Invalid binary input";
  }
}

export default function BinaryToolPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hi!");

  const binary = useMemo(() => (mode === "encode" ? textToBinary(input) : ""), [input, mode]);
  const decoded = useMemo(() => (mode === "decode" ? binaryToText(input) : ""), [input, mode]);
  const bitGroups = useMemo(() => (binary ? binary.split(" ") : []), [binary]);

  const switchMode = (next: "encode" | "decode") => {
    setMode(next);
    setInput(next === "encode" ? "Hi!" : "01001000 01101001 00100001");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Binary Tool" category="Encoding Tools" status="Educational">
        Visualize text as 8-bit bytes. Each character maps to bytes made of 0s and 1s. Understanding this layout is essential for XOR operations, bit shifts, and byte-level cryptographic transforms.
      </PageHeader>
      <Card title="Mode">
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="radio" checked={mode === "encode"} onChange={() => switchMode("encode")} />
            Text to Binary
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="radio" checked={mode === "decode"} onChange={() => switchMode("decode")} />
            Binary to Text
          </label>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input">
          <Field label={mode === "encode" ? "Text input" : "Binary input (8-bit groups, spaces optional)"}>
            <textarea
              className={`field min-h-28 ${mode === "decode" ? "font-mono" : ""}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Field>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setInput(mode === "encode" ? "Hi!" : "01001000 01101001 00100001")}>Sample</button>
            <button className="btn" onClick={() => setInput("")}>Clear</button>
          </div>
        </Card>
        <Card title="Output">
          {mode === "encode" ? (
            <div className="space-y-3">
              <ValueRow label="Binary (space-separated bytes)" value={binary} />
              <ValueRow label="Size" value={`${bitGroups.length} bytes = ${bitGroups.length * 8} bits`} />
            </div>
          ) : (
            <ValueRow label="Decoded text" value={decoded} />
          )}
        </Card>
      </div>
      {mode === "encode" && bitGroups.length > 0 && (
        <Card title="8-bit byte rows">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {bitGroups.slice(0, 32).map((bits, i) => {
              const code = input.charCodeAt(i);
              const char = input[i];
              return (
                <div key={i} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 text-xs text-slate-500">
                    <span className="font-mono font-semibold">{char === " " ? "[space]" : char}</span>
                    <span className="ml-1 text-slate-400">= {code}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {bits.split("").map((bit, j) => (
                      <span
                        key={j}
                        className={`flex-1 rounded py-1 text-center font-mono text-xs font-bold ${bit === "1" ? "bg-cyan-500 text-white" : "bg-slate-200 text-slate-500"}`}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {input.length > 32 && <p className="mt-3 text-xs text-slate-500">Showing first 32 bytes.</p>}
        </Card>
      )}
      <WarningBadge>Binary is a display format. Eight bits form one byte; there are 256 possible byte values (0-255). XOR, AND, OR, and bit-shift operations all work at this level in symmetric and hash algorithms.</WarningBadge>
    </div>
  );
}
