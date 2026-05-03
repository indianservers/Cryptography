export function BitGrid({ bits }: { bits: string }) {
  return <div className="grid grid-cols-8 gap-1">{bits.split("").map((bit, index) => <span key={index} className={`rounded px-2 py-1 text-center font-mono text-xs ${bit === "1" ? "bg-ink text-white" : "bg-slate-100 text-slate-600"}`}>{bit}</span>)}</div>;
}

