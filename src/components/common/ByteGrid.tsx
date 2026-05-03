export function ByteGrid({ bytes, changed = [] }: { bytes: string[]; changed?: number[] }) {
  return <div className="grid grid-cols-4 gap-2">{bytes.map((byte, index) => <div key={index} className={`rounded border px-2 py-2 text-center font-mono text-sm ${changed.includes(index) ? "border-cyan-400 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-50"}`}>{byte}</div>)}</div>;
}

