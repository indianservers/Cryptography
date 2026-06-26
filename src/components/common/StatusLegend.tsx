const items = [
  ["Exact", "Vector-backed or exact classroom logic"],
  ["Conceptual", "Explains structure without standards-compliant output"],
  ["Deprecated", "Kept for study or migration only"],
  ["Unsafe", "Historical or toy security only"],
  ["Secret risk", "Do not paste production secrets"],
  ["Vector required", "Exactness waits for test vectors"],
  ["Web Crypto", "Browser API backed where available"],
];

export function StatusLegend() {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Status legend</div>
      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {items.map(([label, description]) => (
          <div key={label} className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-slate-400 bg-white" aria-hidden="true" />
            <span><span className="font-semibold text-slate-900">{label}</span><span className="text-slate-600">: {description}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}
