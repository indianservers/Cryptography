export interface ModuloJump {
  from: number;
  to: number;
  label: string;
}

export function AnimatedNumberLineModulo({ modulus, currentValue, jumps, activeJump, operationLabel }: { modulus: number; currentValue: number; jumps: ModuloJump[]; activeJump?: number; operationLabel: string }) {
  const safeModulus = Math.max(1, Math.min(modulus, 32));
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="mb-3 text-sm font-semibold text-slate-700">{operationLabel}</div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: safeModulus }, (_, value) => (
          <span key={value} className={`min-w-9 rounded border px-2 py-1 text-center font-mono text-sm ${value === currentValue % safeModulus ? "border-teal-400 bg-teal-50 font-bold text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
            {value === currentValue % safeModulus ? "Current " : ""}{value}
          </span>
        ))}
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {jumps.map((jump, index) => <div key={`${jump.from}-${jump.to}-${jump.label}`} className={`rounded-md border p-2 text-sm ${index === activeJump ? "border-blue-300 bg-blue-50 text-blue-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{index === activeJump ? "Active jump: " : "Jump: "}{jump.from} -&gt; {jump.to}. {jump.label}</div>)}
      </div>
    </div>
  );
}
