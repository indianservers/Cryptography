import { getLearningContent } from "../../data/moduleLearningContent";
import { CheckpointQuiz } from "./CheckpointQuiz";
import { ConceptualBoundaryNote } from "./ConceptualBoundaryNote";
import { FormulaPanel } from "./FormulaPanel";
import { LearningObjectivePanel } from "./LearningObjectivePanel";
import { MisconceptionCard } from "./MisconceptionCard";
import { ObservationGuide } from "./ObservationGuide";
import { ResultSummary } from "./ResultSummary";

export function ModuleLearningSection({ route }: { route: string }) {
  const content = getLearningContent(route);
  if (!content) return null;

  return (
    <section className="mt-5 space-y-4" aria-label={`${content.title} learning guide`}>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <LearningObjectivePanel content={content} />
        <FormulaPanel content={content} />
      </div>
      {content.conceptualBoundary && <ConceptualBoundaryNote note={content.conceptualBoundary} />}
      <ObservationGuide content={content} />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <MisconceptionCard content={content} />
        <div className="space-y-4">
          <section className="rounded-md border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Constraints and use</div>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {content.constraints.map((constraint) => (
                <div key={constraint} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">{constraint}</div>
              ))}
            </div>
            <p className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{content.realWorldUse}</p>
          </section>
          {content.resultInterpretationTemplate && <ResultSummary title={`${content.title} final output`} summary={content.resultInterpretationTemplate} />}
        </div>
      </div>
      <CheckpointQuiz questions={content.checkpointQuestions} />
    </section>
  );
}
