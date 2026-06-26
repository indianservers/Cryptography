import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export function StepControls({ step, max, onStep }: { step: number; max: number; onStep: (step: number) => void }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => {
      onStep(step >= max ? 0 : step + 1);
    }, Math.max(150, 1200 - speed * 180));
    return () => window.clearInterval(interval);
  }, [max, onStep, playing, speed, step]);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <button className="icon-btn" onClick={() => onStep(Math.max(0, step - 1))} title="Previous step"><SkipBack /></button>
      <button className="icon-btn" onClick={() => onStep(Math.min(max, step + 1))} title="Next step"><SkipForward /></button>
      <button className="icon-btn" onClick={() => setPlaying(true)} title="Auto play"><Play /></button>
      <button className="icon-btn" onClick={() => setPlaying(false)} title="Pause"><Pause /></button>
      <button className="icon-btn" onClick={() => { setPlaying(false); onStep(0); }} title="Reset"><RotateCcw /></button>
      <label className="ml-2 text-sm text-slate-600">Animation speed <input type="range" min="1" max="5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="align-middle" /></label>
      {playing && <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">Playing</span>}
      <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800">{Math.max(0, max - step)} remaining</span>
      <span className="ml-auto font-mono text-sm">Step {step + 1} / {max + 1}</span>
    </div>
  );
}
