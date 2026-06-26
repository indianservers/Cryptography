import { useMemo, useState } from "react";
import type { GuidedLesson } from "../data/moduleGuidedContent";

function storageKey(route: string) {
  return `guided-mode:${route}`;
}

export function useGuidedMode(lesson?: GuidedLesson) {
  const route = lesson?.route ?? "missing";
  const stored = useMemo(() => {
    if (!lesson || typeof localStorage === "undefined") return { step: 0, complete: false };
    try {
      return JSON.parse(localStorage.getItem(storageKey(route)) ?? "{}") as { step?: number; complete?: boolean };
    } catch {
      return { step: 0, complete: false };
    }
  }, [lesson, route]);
  const [stepIndex, setStepIndex] = useState(stored.step ?? 0);
  const [hintVisible, setHintVisible] = useState(false);
  const [complete, setComplete] = useState(Boolean(stored.complete));
  const max = Math.max(0, (lesson?.steps.length ?? 1) - 1);
  const currentStep = lesson?.steps[Math.min(stepIndex, max)];

  const persist = (step: number, done = complete) => {
    if (!lesson || typeof localStorage === "undefined") return;
    localStorage.setItem(storageKey(route), JSON.stringify({ step, complete: done }));
  };

  const go = (step: number) => {
    const next = Math.min(Math.max(0, step), max);
    setStepIndex(next);
    setHintVisible(false);
    persist(next);
  };

  return {
    stepIndex,
    currentStep,
    complete,
    hintVisible,
    totalSteps: lesson?.steps.length ?? 0,
    next: () => go(stepIndex + 1),
    previous: () => go(stepIndex - 1),
    reset: () => {
      setComplete(false);
      go(0);
      persist(0, false);
    },
    revealHint: () => setHintVisible(true),
    markComplete: () => {
      setComplete(true);
      persist(stepIndex, true);
    },
  };
}
