export function ResultSummary({ title, summary }: { title: string; summary: string }) {
  return (
    <section className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-emerald-800">Result summary</div>
      <h2 className="mt-1 text-base font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-700">{summary}</p>
    </section>
  );
}
