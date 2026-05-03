import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export function StepControls({ step, max, onStep }: { step: number; max: number; onStep: (step: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <button className="icon-btn" onClick={() => onStep(Math.max(0, step - 1))} title="Previous step"><SkipBack /></button>
      <button className="icon-btn" onClick={() => onStep(Math.min(max, step + 1))} title="Next step"><SkipForward /></button>
      <button className="icon-btn" title="Auto play"><Play /></button>
      <button className="icon-btn" title="Pause"><Pause /></button>
      <button className="icon-btn" onClick={() => onStep(0)} title="Reset"><RotateCcw /></button>
      <label className="ml-2 text-sm text-slate-600">Animation speed <input type="range" min="1" max="5" defaultValue="3" className="align-middle" /></label>
      <span className="ml-auto font-mono text-sm">Step {step + 1} / {max + 1}</span>
    </div>
  );
}

