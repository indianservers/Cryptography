import type { ModuleLearningContent } from "../../data/moduleLearningContent";

export function ObservationGuide({ content }: { content: ModuleLearningContent }) {
  return (
    <section className="rounded-md border border-teal-200 bg-teal-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-teal-800">What to observe</div>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          {content.observationPrompts.map((prompt) => (
            <div key={prompt} className="rounded-md border border-teal-100 bg-white p-3 text-sm font-medium text-teal-950">{prompt}</div>
          ))}
        </div>
        <div className="space-y-2">
          {content.expectedPatterns.map((pattern) => (
            <div key={pattern} className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">{pattern}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
