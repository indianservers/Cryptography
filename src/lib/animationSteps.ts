export interface AnimationStep {
  id: string;
  title: string;
  description: string;
  focusItems?: string[];
  inputState?: string;
  outputState?: string;
  formula?: string;
  warning?: string;
  durationMs?: number;
}

export interface AnimationSequence {
  id: string;
  title: string;
  steps: AnimationStep[];
  reducedMotionSummary: string;
  exactnessNote?: string;
}

export function clampStepIndex(index: number, steps: AnimationStep[]) {
  if (!steps.length) return 0;
  return Math.min(Math.max(0, index), steps.length - 1);
}

export function getCurrentStep(sequence: AnimationSequence, index: number) {
  return sequence.steps[clampStepIndex(index, sequence.steps)];
}

export function nextStep(index: number, steps: AnimationStep[]) {
  if (!steps.length) return 0;
  return index >= steps.length - 1 ? 0 : index + 1;
}

export function previousStep(index: number, steps: AnimationStep[]) {
  if (!steps.length) return 0;
  return index <= 0 ? steps.length - 1 : index - 1;
}

export function resetStep() {
  return 0;
}

export function shouldAutoPlay(prefersReducedMotion: boolean, userSetting?: boolean) {
  return Boolean(userSetting) && !prefersReducedMotion;
}

export function buildStepLabel(current: number, total: number) {
  return `Step ${Math.min(Math.max(current, 1), Math.max(total, 1))} of ${Math.max(total, 1)}`;
}
