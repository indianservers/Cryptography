import { describe, expect, it } from "vitest";
import {
  moduleAnimationContent,
  moduleAnimationEntries,
  requiredPhase5AnimationRoutes,
} from "../src/data/moduleAnimationContent";
import { moduleAuditRegistry } from "../src/data/moduleAuditRegistry";

const unsafeOverclaims = [
  "production ready",
  "real wallet",
  "real certificate validation",
  "unbreakable",
  "official output",
  "guaranteed secure",
];

const conceptualDecisions = new Set(["conceptual-only", "hybrid-exact-core", "deferred-needs-library"]);

function animationText(route: string) {
  const entry = moduleAnimationContent[route];
  return [
    entry.sequence.title,
    entry.sequence.reducedMotionSummary,
    entry.sequence.exactnessNote ?? "",
    entry.safetyNote ?? "",
    ...entry.sequence.steps.flatMap((step) => [step.id, step.title, step.description, step.formula ?? "", step.warning ?? ""]),
  ].join(" ").toLowerCase();
}

describe("module animation content", () => {
  it("covers every required Phase 5 route", () => {
    for (const route of requiredPhase5AnimationRoutes) {
      expect(moduleAnimationContent[route], route).toBeTruthy();
    }
  });

  it("defines complete step sequences", () => {
    for (const entry of moduleAnimationEntries) {
      expect(entry.sequence.steps.length, entry.route).toBeGreaterThanOrEqual(3);
      expect(entry.sequence.reducedMotionSummary.trim(), entry.route).not.toHaveLength(0);
      for (const step of entry.sequence.steps) {
        expect(step.id.trim(), entry.route).not.toHaveLength(0);
        expect(step.title.trim(), entry.route).not.toHaveLength(0);
        expect(step.description.trim(), entry.route).not.toHaveLength(0);
      }
    }
  });

  it("keeps conceptual or deferred animation routes explicitly bounded", () => {
    for (const entry of moduleAnimationEntries) {
      const auditEntry = moduleAuditRegistry[entry.route];
      if (!auditEntry) continue;
      if (conceptualDecisions.has(auditEntry.phase2Decision) || auditEntry.implementationAccuracy === "CONCEPTUAL_PREVIEW") {
        expect(Boolean(entry.sequence.exactnessNote || entry.safetyNote), entry.route).toBe(true);
      }
    }
  });

  it("keeps attack animations defensive", () => {
    const attackEntries = moduleAnimationEntries.filter((entry) => entry.route.includes("/attacks/"));
    for (const entry of attackEntries) {
      const text = animationText(entry.route);
      expect(/defensive|mitigation|warning|authorized|toy|prevent|uniform|safe/.test(text), entry.route).toBe(true);
    }
  });

  it("does not contain unsafe overclaim phrases", () => {
    for (const entry of moduleAnimationEntries) {
      const text = animationText(entry.route);
      for (const phrase of unsafeOverclaims) {
        expect(text, `${entry.route} contains ${phrase}`).not.toContain(phrase);
      }
    }
  });
});
