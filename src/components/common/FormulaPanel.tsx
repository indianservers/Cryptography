import type { ModuleLearningContent } from "../../data/moduleLearningContent";

export function FormulaPanel({ content }: { content: ModuleLearningContent }) {
  return (
    <section className="rounded-md border border-indigo-200 bg-white p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-indigo-700">Formula / rule</div>
      <h2 className="mt-1 text-base font-bold text-slate-900">{content.formulaTitle}</h2>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 p-3 font-mono text-sm text-indigo-950">{content.formula}</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {content.variables.map((variable) => (
          <div key={`${variable.symbol}-${variable.meaning}`} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm">
            <span className="font-mono font-bold text-slate-900">{variable.symbol}</span>
            <span className="text-slate-600">: {variable.meaning}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
