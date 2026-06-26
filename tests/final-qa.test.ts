import { describe, expect, it } from "vitest";
import { finalQAMatrix } from "../src/data/finalQAChecklist";
import { moduleAnimationContent } from "../src/data/moduleAnimationContent";
import { moduleGuidedContent } from "../src/data/moduleGuidedContent";
import { moduleChallenges } from "../src/data/moduleChallenges";

describe("final QA matrix", () => {
  it("has no missing route or title", () => {
    for (const row of finalQAMatrix) {
      expect(row.route.trim(), row.title).not.toHaveLength(0);
      expect(row.title.trim(), row.route).not.toHaveLength(0);
    }
  });

  it("has audit registry and status boundary coverage", () => {
    for (const row of finalQAMatrix) {
      expect(row.hasAuditRegistry, row.route).toBe(true);
      expect(row.hasStatusBoundary, row.route).toBe(true);
    }
  });

  it("backs exact routes with verification", () => {
    for (const row of finalQAMatrix) expect(row.exactnessBackedByTest, row.route).toBe(true);
  });

  it("keeps conceptual and secret-risk routes warning-aware", () => {
    for (const row of finalQAMatrix) {
      expect(row.hasSafetyWarningIfNeeded, row.route).toBe(true);
      expect(row.conceptualBoundaryIfNeeded, row.route).toBe(true);
    }
  });

  it("preserves Phase 5, guided, and challenge integrity", () => {
    for (const route of Object.keys(moduleAnimationContent)) {
      expect(finalQAMatrix.find((row) => row.route === route)?.hasAnimationContent, route).toBe(true);
    }
    for (const route of Object.keys(moduleGuidedContent)) {
      expect(finalQAMatrix.find((row) => row.route === route)?.hasGuidedContent, route).toBe(true);
    }
    for (const route of new Set(moduleChallenges.map((challenge) => challenge.route))) {
      expect(finalQAMatrix.find((row) => row.route === route)?.hasChallenge, route).toBe(true);
    }
  });
});
