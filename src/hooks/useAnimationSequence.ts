import { useCallback, useEffect, useState } from "react";
import type { AnimationSequence } from "../lib/animationSteps";
import { clampStepIndex, nextStep, previousStep, resetStep, shouldAutoPlay } from "../lib/animationSteps";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useAnimationSequence(sequence: AnimationSequence, options: { autoPlay?: boolean; intervalMs?: number } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(() => shouldAutoPlay(prefersReducedMotion, options.autoPlay));
  const totalSteps = sequence.steps.length;
  const intervalMs = options.intervalMs ?? sequence.steps[stepIndex]?.durationMs ?? 1400;

  useEffect(() => {
    setStepIndex((current) => clampStepIndex(current, sequence.steps));
  }, [sequence]);

  useEffect(() => {
    if (prefersReducedMotion) setPlaying(false);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!playing || prefersReducedMotion || totalSteps <= 1) return;
    const timeout = window.setTimeout(() => {
      setStepIndex((current) => nextStep(current, sequence.steps));
    }, Math.max(400, intervalMs));
    return () => window.clearTimeout(timeout);
  }, [intervalMs, playing, prefersReducedMotion, sequence.steps, totalSteps]);

  const goNext = useCallback(() => setStepIndex((current) => nextStep(current, sequence.steps)), [sequence.steps]);
  const goPrevious = useCallback(() => setStepIndex((current) => previousStep(current, sequence.steps)), [sequence.steps]);
  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(resetStep());
  }, []);
  const replay = useCallback(() => {
    setStepIndex(resetStep());
    setPlaying(!prefersReducedMotion);
  }, [prefersReducedMotion]);
  const pause = useCallback(() => setPlaying(false), []);
  const play = useCallback(() => {
    if (!prefersReducedMotion) setPlaying(true);
  }, [prefersReducedMotion]);

  return {
    stepIndex,
    currentStep: sequence.steps[clampStepIndex(stepIndex, sequence.steps)],
    playing,
    prefersReducedMotion,
    totalSteps,
    canPlay: !prefersReducedMotion && totalSteps > 1,
    goNext,
    goPrevious,
    reset,
    replay,
    pause,
    play,
    setStepIndex: (index: number) => setStepIndex(clampStepIndex(index, sequence.steps)),
  };
}
