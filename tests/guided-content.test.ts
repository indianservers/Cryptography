import { describe, expect, it } from "vitest";
import { moduleGuidedContent, moduleGuidedEntries, requiredGuidedRoutes } from "../src/data/moduleGuidedContent";

describe("guided content", () => {
  it("covers all required guided routes", () => {
    for (const route of requiredGuidedRoutes) expect(moduleGuidedContent[route], route).toBeTruthy();
  });

  it("has complete safe lesson steps", () => {
    for (const lesson of moduleGuidedEntries) {
      expect(lesson.steps.length, lesson.route).toBeGreaterThanOrEqual(3);
      expect(lesson.objective.trim(), lesson.route).not.toHaveLength(0);
      expect(lesson.completionMessage.trim(), lesson.route).not.toHaveLength(0);
      for (const step of lesson.steps) {
        expect(step.instruction.trim(), lesson.route).not.toHaveLength(0);
        expect(step.learnerAction.trim(), lesson.route).not.toHaveLength(0);
        expect(step.expectedObservation.trim(), lesson.route).not.toHaveLength(0);
        expect(`${step.instruction} ${step.learnerAction}`.toLowerCase(), lesson.route).not.toContain("real secret");
      }
    }
  });

  it("keeps attack lessons defensive", () => {
    for (const lesson of moduleGuidedEntries.filter((item) => item.route.includes("/attacks/"))) {
      const text = lesson.steps.map((step) => `${step.instruction} ${step.learnerAction} ${step.expectedObservation} ${step.safetyNote ?? ""}`).join(" ").toLowerCase();
      expect(/defensive|mitigation|toy|prevent|uniform|safe/.test(text), lesson.route).toBe(true);
    }
  });
});
