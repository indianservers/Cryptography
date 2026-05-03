export function ByteGrid({ bytes, changed = [], format = "hex" }: { bytes: string[]; changed?: number[]; format?: "hex" | "binary" | "decimal" }) {
  const display = (byte: string) => {
    const value = parseInt(byte, 16);
    if (!Number.isFinite(value)) return byte;
    if (format === "binary") return value.toString(2).padStart(8, "0");
    if (format === "decimal") return String(value);
    return byte;
  };
  return <div className="grid grid-cols-4 gap-2 matrix-view">{bytes.map((byte, index) => <div key={index} title={`byte ${index}: hex ${byte}, decimal ${parseInt(byte, 16)}, binary ${parseInt(byte, 16).toString(2).padStart(8, "0")}`} className={`rounded border px-2 py-2 text-center font-mono text-sm ${changed.includes(index) ? "changed-byte border-cyan-400 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-50"}`}>{display(byte)}</div>)}</div>;
}
