import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { buildStepLabel } from "../../lib/animationSteps";

export function StepPlaybackControls({
  stepIndex,
  totalSteps,
  playing,
  canPlay,
  onPrevious,
  onNext,
  onPlay,
  onPause,
  onReset,
  onReplay,
}: {
  stepIndex: number;
  totalSteps: number;
  playing: boolean;
  canPlay: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onReplay: () => void;
}) {
  const label = buildStepLabel(stepIndex + 1, totalSteps);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <button type="button" className="btn btn-secondary" onClick={onPrevious} aria-label="Previous animation step"><SkipBack className="h-4 w-4" /> Previous</button>
      <button type="button" className="btn btn-secondary" onClick={onNext} aria-label="Next animation step"><SkipForward className="h-4 w-4" /> Next</button>
      <button type="button" className="btn btn-primary" onClick={playing ? onPause : onPlay} disabled={!canPlay} aria-label={playing ? "Pause animation" : "Play animation"}>
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {playing ? "Pause" : "Play"}
      </button>
      <button type="button" className="btn" onClick={onReplay} disabled={!canPlay} aria-label="Replay animation"><RotateCcw className="h-4 w-4" /> Replay</button>
      <button type="button" className="btn" onClick={onReset} aria-label="Reset animation">Reset</button>
      <span className="ml-auto rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-900">{label}</span>
    </div>
  );
}
