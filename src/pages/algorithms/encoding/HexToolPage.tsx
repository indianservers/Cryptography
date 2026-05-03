import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { textToHex, hexPairs } from "../../../lib/format";

function hexToText(hex: string): string {
  try {
    const bytes = hexPairs(hex).map((b) => parseInt(b, 16));
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "Invalid hex";
  }
}

export default function HexToolPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, cryptography!");
  const [grouping, setGrouping] = useState(1);

  const hexRaw = useMemo(() => (mode === "encode" ? textToHex(input) : ""), [input, mode]);

  const grouped = useMemo(() => {
    const pairs = hexRaw.match(/.{1,2}/g) ?? [];
    const chunks: string[] = [];
    for (let i = 0; i < pairs.length; i += grouping) {
      chunks.push(pairs.slice(i, i + grouping).join(""));
    }
    return chunks.join(" ");
  }, [hexRaw, grouping]);

  const decoded = useMemo(() => (mode === "decode" ? hexToText(input) : ""), [input, mode]);

  const switchMode = (next: "encode" | "decode") => {
    setMode(next);
    setInput(next === "encode" ? "Hello, cryptography!" : "48656c6c6f");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Hex Tool" category="Encoding Tools" status="Educational">
        Convert text to hexadecimal byte representation and back. Hex is the standard display format for binary cryptographic data such as keys, IVs, and digests.
      </PageHeader>
      <Card title="Mode">
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="radio" checked={mode === "encode"} onChange={() => switchMode("encode")} />
            Text to Hex
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="radio" checked={mode === "decode"} onChange={() => switchMode("decode")} />
            Hex to Text
          </label>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input">
          <Field label={mode === "encode" ? "Text input" : "Hex input"}>
            <textarea
              className={`field min-h-28 ${mode === "decode" ? "font-mono" : ""}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Field>
          {mode === "encode" && (
            <div className="mt-3">
              <label className="text-sm font-medium">
                Byte grouping: {grouping} byte{grouping > 1 ? "s" : ""}
                <input
                  type="range" min="1" max="8" value={grouping}
                  onChange={(e) => setGrouping(Number(e.target.value))}
                  className="ml-2 w-32 align-middle"
                />
              </label>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setInput(mode === "encode" ? "Hello, cryptography!" : "48656c6c6f")}>Sample</button>
            <button className="btn" onClick={() => setInput("")}>Clear</button>
          </div>
        </Card>
        <Card title="Output">
          {mode === "encode" ? (
            <div className="space-y-3">
              <ValueRow label="Hex (grouped)" value={grouped} />
              <ValueRow label="Raw hex (no spaces)" value={hexRaw} />
              <ValueRow label="Byte count" value={`${hexRaw.length / 2} bytes`} />
            </div>
          ) : (
            <ValueRow label="Decoded text" value={decoded} />
          )}
        </Card>
      </div>
      {mode === "encode" && (
        <Card title="Nibble table (first 32 characters)">
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm font-mono">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Char</th>
                  <th className="p-2 text-left">ASCII</th>
                  <th className="p-2 text-left">High nibble</th>
                  <th className="p-2 text-left">Low nibble</th>
                  <th className="p-2 text-left">Hex</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(input.slice(0, 32)).map((char, i) => {
                  const code = char.charCodeAt(0);
                  const hex = code.toString(16).padStart(2, "0");
                  return (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="p-2">{char === " " ? "[space]" : char}</td>
                      <td className="p-2">{code}</td>
                      <td className="p-2 text-cyan-600">{hex[0]}</td>
                      <td className="p-2 text-cyan-800">{hex[1]}</td>
                      <td className="p-2 font-bold">{hex}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {input.length > 32 && <p className="p-2 text-xs text-slate-500">Showing first 32 characters.</p>}
          </div>
        </Card>
      )}
      <WarningBadge>Hex encoding doubles the display length but adds no secrecy or error detection. It is a human-readable display convention for binary data, not a form of encryption.</WarningBadge>
    </div>
  );
}
