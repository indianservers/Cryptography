export function MatrixView({ values, columns = 4, changed = [], format = "hex" }: { values: string[]; columns?: number; changed?: number[]; format?: "hex" | "binary" | "decimal" }) {
  const display = (value: string) => {
    const parsed = parseInt(value, 16);
    if (!Number.isFinite(parsed)) return value;
    if (format === "binary") return parsed.toString(2).padStart(8, "0");
    if (format === "decimal") return String(parsed);
    return value;
  };
  return <div className="grid gap-2 matrix-view" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{values.map((value, index) => <div key={index} title={`index ${index}: hex ${value}, decimal ${parseInt(value, 16)}, binary ${parseInt(value, 16).toString(2).padStart(8, "0")}`} className={`rounded-md border px-3 py-3 text-center font-mono text-sm ${changed.includes(index) ? "changed-byte border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}`}>{display(value)}</div>)}</div>;
}
