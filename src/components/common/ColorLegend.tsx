const roles = [
  ["Input", "bg-slate-100 border-slate-300"],
  ["Key", "bg-indigo-100 border-indigo-300"],
  ["Padding", "bg-amber-100 border-amber-300"],
  ["Nonce / IV", "bg-violet-100 border-violet-300"],
  ["Tag", "bg-emerald-100 border-emerald-300"],
  ["Changed", "bg-cyan-100 border-cyan-300"],
];

export function ColorLegend() {
  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
      {roles.map(([label, color]) => <span key={label} className="inline-flex items-center gap-2"><span className={`h-3 w-3 rounded border ${color}`} />{label}</span>)}
    </div>
  );
}
