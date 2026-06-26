import type { ModuleLearningContent } from "../../data/moduleLearningContent";

export function LearningObjectivePanel({ content }: { content: ModuleLearningContent }) {
  return (
    <section className="rounded-md border border-sky-200 bg-sky-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-sky-800">Learning objective</div>
      <h2 className="mt-1 text-base font-bold text-slate-900">{content.title}</h2>
      <p className="mt-2 text-sm text-slate-700">{content.objective}</p>
      <div className="mt-3 rounded-md border border-sky-100 bg-white p-3 text-sm font-medium text-sky-950">
        {content.beginnerTakeaway}
      </div>
    </section>
  );
}
