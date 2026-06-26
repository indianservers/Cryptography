import type { ModuleLearningContent } from "../../data/moduleLearningContent";

export function MisconceptionCard({ content }: { content: ModuleLearningContent }) {
  return (
    <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-amber-900">Common misconception</div>
      <div className="mt-3 grid gap-2">
        {content.misconceptions.map((item) => (
          <div key={item.myth} className="rounded-md border border-amber-200 bg-white p-3 text-sm">
            <div className="font-semibold text-amber-950">{item.myth}</div>
            <p className="mt-1 text-slate-700">{item.correction}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
