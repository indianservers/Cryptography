export function MatrixView({ values, columns = 4, changed = [] }: { values: string[]; columns?: number; changed?: number[] }) {
  return <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>{values.map((value, index) => <div key={index} className={`rounded-md border px-3 py-3 text-center font-mono text-sm ${changed.includes(index) ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}`}>{value}</div>)}</div>;
}

