export interface PresetOption {
  label: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Invalid";
  apply: () => void;
}

const toneFor = (difficulty: PresetOption["difficulty"]) => {
  if (difficulty === "Beginner") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (difficulty === "Intermediate") return "border-blue-200 bg-blue-50 text-blue-900";
  if (difficulty === "Advanced") return "border-violet-200 bg-violet-50 text-violet-900";
  return "border-amber-200 bg-amber-50 text-amber-950";
};

export function PresetBar({ presets, activePreset }: { presets: PresetOption[]; activePreset?: string }) {
  if (!presets.length) return null;
  return (
    <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm" aria-label="Sample presets">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Presets</div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={`min-h-11 rounded-md border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${activePreset === preset.label ? "border-teal-600 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50"}`}
            onClick={preset.apply}
          >
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase ${toneFor(preset.difficulty)}`}>{preset.difficulty}</span>
            <span className="mt-2 block font-semibold text-slate-900">{preset.label}</span>
            <span className="mt-1 block text-sm text-slate-600">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
