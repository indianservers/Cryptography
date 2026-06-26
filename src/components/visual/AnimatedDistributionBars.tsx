export interface DistributionBar {
  id: string;
  label: string;
  value: number;
}

export function AnimatedDistributionBars({ bars, activeBar, benchmarkLine, caption }: { bars: DistributionBar[]; activeBar?: string; benchmarkLine?: number; caption?: string }) {
  const max = Math.max(...bars.map((bar) => bar.value), benchmarkLine ?? 0, 1);
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      {caption && <div className="mb-3 text-sm font-semibold text-slate-700">{caption}</div>}
      <div className="space-y-2">
        {bars.map((bar) => {
          const active = bar.id === activeBar;
          return (
            <div key={bar.id} className="grid grid-cols-[5rem_minmax(0,1fr)_4rem] items-center gap-2 text-sm">
              <div className="font-semibold text-slate-700">{active ? "Current " : ""}{bar.label}</div>
              <div className="h-6 rounded border border-slate-200 bg-slate-50">
                <div className={`h-full rounded ${active ? "bg-teal-500" : "bg-blue-400"}`} style={{ width: `${Math.max(4, (bar.value / max) * 100)}%` }} />
              </div>
              <div className="font-mono text-slate-700">{bar.value}</div>
            </div>
          );
        })}
      </div>
      {benchmarkLine !== undefined && <p className="mt-3 text-xs font-semibold text-slate-600">Benchmark line: {benchmarkLine}</p>}
    </div>
  );
}
