import type { AnimationStep } from "../../lib/animationSteps";

export function CurrentStepNarration({ step, exactnessNote, warning, reducedMotion }: { step: AnimationStep; exactnessNote?: string; warning?: string; reducedMotion?: boolean }) {
  return (
    <section className="rounded-md border border-teal-200 bg-teal-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-teal-800">{reducedMotion ? "Static step explanation" : "Current animation step"}</div>
      <h3 className="mt-1 text-lg font-bold text-slate-900">{step.title}</h3>
      <p className="mt-2 text-sm text-slate-700">{step.description}</p>
      {step.formula && <p className="mt-3 rounded-md border border-teal-100 bg-white p-3 font-mono text-sm text-teal-950">{step.formula}</p>}
      {(warning || step.warning) && <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-950">{warning ?? step.warning}</p>}
      {exactnessNote && <p className="mt-3 rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">{exactnessNote}</p>}
    </section>
  );
}
