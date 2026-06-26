export interface LetterMapping {
  source: string;
  target: string;
  label?: string;
}

export function AnimatedAlphabetMap({ sourceAlphabet, targetAlphabet, activeSourceIndex, activeTargetIndex, mappings }: { sourceAlphabet: string; targetAlphabet: string; activeSourceIndex?: number; activeTargetIndex?: number; mappings?: LetterMapping[] }) {
  const pairs = mappings ?? sourceAlphabet.split("").map((source, index) => ({ source, target: targetAlphabet[index] ?? "", label: `${source} maps to ${targetAlphabet[index] ?? ""}` }));
  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap gap-1">
        {sourceAlphabet.split("").map((letter, index) => <span key={`s-${letter}-${index}`} className={`min-w-8 rounded border px-2 py-1 text-center font-mono text-sm ${index === activeSourceIndex ? "border-teal-400 bg-teal-50 font-bold text-teal-950" : "border-slate-200 bg-slate-50"}`}>{index === activeSourceIndex ? "Current " : ""}{letter}</span>)}
      </div>
      <div className="flex flex-wrap gap-1">
        {targetAlphabet.split("").map((letter, index) => <span key={`t-${letter}-${index}`} className={`min-w-8 rounded border px-2 py-1 text-center font-mono text-sm ${index === activeTargetIndex ? "border-blue-400 bg-blue-50 font-bold text-blue-950" : "border-slate-200 bg-slate-50"}`}>{index === activeTargetIndex ? "Output " : ""}{letter}</span>)}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {pairs.slice(0, 6).map((mapping, index) => {
          const active = index === activeSourceIndex || mapping.source === sourceAlphabet[activeSourceIndex ?? -1];
          return <div key={`${mapping.source}-${mapping.target}-${index}`} className={`rounded-md border p-2 text-sm ${active ? "border-teal-300 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{active ? "Current mapping: " : "Mapping: "}{mapping.label ?? `${mapping.source} -> ${mapping.target}`}</div>;
        })}
      </div>
    </div>
  );
}
