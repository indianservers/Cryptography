import { getGuidedLesson } from "../../data/moduleGuidedContent";
import { useGuidedMode } from "../../hooks/useGuidedMode";

export function GuidedModePanel({ route }: { route: string }) {
  const lesson = getGuidedLesson(route);
  const guided = useGuidedMode(lesson);
  if (!lesson || !guided.currentStep) return null;

  return (
    <section className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4" aria-label={`${lesson.title} guided mode`}>
      <div className="text-xs font-bold uppercase tracking-wide text-emerald-800">Guided mode</div>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{lesson.title}</h2>
          <p className="mt-1 text-sm text-slate-700">{lesson.objective}</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-sm font-bold text-emerald-900">{lesson.estimatedMinutes} min</span>
      </div>
      <div className="mt-4 rounded-md border border-emerald-100 bg-white p-4">
        <div className="text-sm font-bold text-emerald-800">Step {guided.stepIndex + 1} of {guided.totalSteps}: {guided.currentStep.title}</div>
        <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Instruction:</span> {guided.currentStep.instruction}</p>
        <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Learner action:</span> {guided.currentStep.learnerAction}</p>
        <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Expected observation:</span> {guided.currentStep.expectedObservation}</p>
        {guided.currentStep.safetyNote && <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-sm font-semibold text-amber-950">{guided.currentStep.safetyNote}</p>}
        {guided.hintVisible && guided.currentStep.hint && <p className="mt-3 rounded-md border border-blue-200 bg-blue-50 p-2 text-sm text-blue-950">{guided.currentStep.hint}</p>}
      </div>
      {guided.complete && <p className="mt-3 rounded-md border border-emerald-300 bg-white p-3 text-sm font-semibold text-emerald-900">{lesson.completionMessage}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn" onClick={guided.previous}>Previous</button>
        <button type="button" className="btn btn-primary" onClick={guided.next}>Next</button>
        <button type="button" className="btn" onClick={guided.revealHint} disabled={!guided.currentStep.hint}>Show hint</button>
        <button type="button" className="btn btn-success" onClick={guided.markComplete}>Mark complete</button>
        <button type="button" className="btn btn-secondary" onClick={guided.reset}>Reset</button>
      </div>
    </section>
  );
}
