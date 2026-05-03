export function AvalancheChart({ changedBits }: { changedBits: number }) {
  const pct = Math.min(100, Math.round((changedBits / 128) * 100));
  return <div><div className="mb-2 flex justify-between text-sm"><span>Avalanche changed bits</span><span className="font-mono">{changedBits}/128</span></div><div className="h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-cyan-500" style={{ width: `${pct}%` }} /></div></div>;
}

