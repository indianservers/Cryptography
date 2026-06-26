export interface IntermediateStep {
  label: string;
  value?: string;
  detail?: string;
}

export function IntermediateStepsPanel({ title, steps, currentStep, compact = false, children }: { title: string; steps?: IntermediateStep[]; currentStep?: number; compact?: boolean; children?: React.ReactNode }) {
  return (
    <section id="intermediate-steps" className="rounded-md border border-blue-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wide text-blue-700">Intermediate steps</div>
      <h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
      {steps && steps.length > 0 && (
        <div className="mt-3 overflow-x-auto">
          <div className="min-w-full space-y-2">
            {steps.map((step, index) => {
              const active = currentStep === index;
              return (
                <div key={`${step.label}-${index}`} className={`rounded-md border p-3 text-sm ${active ? "border-teal-300 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"} ${compact ? "py-2" : ""}`}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-slate-600">Step {index + 1}</span>
                    {active && <span className="rounded-full border border-teal-200 bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-teal-800">Current</span>}
                    <span className="font-semibold">{step.label}</span>
                  </div>
                  {step.value && <div className="crypto-wrap mt-2 font-mono">{step.value}</div>}
                  {step.detail && <p className="mt-1 text-slate-600">{step.detail}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {children && <div className="mt-3 overflow-x-auto">{children}</div>}
    </section>
  );
}
