import { describe, expect, it } from "vitest";
import {
  buildStepLabel,
  clampStepIndex,
  nextStep,
  previousStep,
  resetStep,
  shouldAutoPlay,
  type AnimationStep,
} from "../src/lib/animationSteps";

const steps: AnimationStep[] = [
  { id: "one", title: "One", description: "First step" },
  { id: "two", title: "Two", description: "Second step" },
  { id: "three", title: "Three", description: "Third step" },
];

describe("animation step helpers", () => {
  it("clamps step index safely", () => {
    expect(clampStepIndex(-4, steps)).toBe(0);
    expect(clampStepIndex(1, steps)).toBe(1);
    expect(clampStepIndex(99, steps)).toBe(2);
    expect(clampStepIndex(2, [])).toBe(0);
  });

  it("moves next and wraps at the end", () => {
    expect(nextStep(0, steps)).toBe(1);
    expect(nextStep(2, steps)).toBe(0);
    expect(nextStep(2, [])).toBe(0);
  });

  it("moves previous and wraps at the beginning", () => {
    expect(previousStep(2, steps)).toBe(1);
    expect(previousStep(0, steps)).toBe(2);
    expect(previousStep(0, [])).toBe(0);
  });

  it("resets to the first step", () => {
    expect(resetStep()).toBe(0);
  });

  it("builds human-readable step labels", () => {
    expect(buildStepLabel(2, 6)).toBe("Step 2 of 6");
    expect(buildStepLabel(0, 6)).toBe("Step 1 of 6");
    expect(buildStepLabel(99, 6)).toBe("Step 6 of 6");
  });

  it("disables autoplay for reduced motion", () => {
    expect(shouldAutoPlay(true, true)).toBe(false);
    expect(shouldAutoPlay(false, true)).toBe(true);
    expect(shouldAutoPlay(false, false)).toBe(false);
  });
});
