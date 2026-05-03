export function RoundTimeline({ steps, active = 0 }: { steps: string[]; active?: number }) {
  return <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">{steps.map((step, index) => <li key={step} className={`rounded-md border p-3 text-sm ${index === active ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}`}><span className="font-mono text-xs text-slate-500">#{index + 1}</span><div className="font-semibold">{step}</div></li>)}</ol>;
}

