import { describe, expect, it } from "vitest";
import { algorithmMetadata } from "../src/data/algorithmMetadata";
import { allAlgorithmLearningContent, phaseTwoAlgorithms } from "../src/data/phaseTwoAlgorithmContent";
import { phaseOneAlgorithms } from "../src/data/phaseOneAlgorithmContent";

describe("phase two algorithm content expansion", () => {
  it("covers every algorithm metadata route across phase one and phase two", () => {
    const metadataRoutes = new Set(algorithmMetadata.map((item) => item.route));
    const contentRoutes = new Set(allAlgorithmLearningContent.map((item) => item.route));

    expect(contentRoutes.size).toBe(metadataRoutes.size);
    for (const route of metadataRoutes) {
      expect(contentRoutes.has(route), route).toBe(true);
    }
  });

  it("keeps phase two scoped to routes not already completed in phase one", () => {
    const phaseOneRoutes = new Set(phaseOneAlgorithms.map((item) => item.route));
    expect(phaseTwoAlgorithms.length).toBe(algorithmMetadata.length - phaseOneAlgorithms.length);
    for (const item of phaseTwoAlgorithms) {
      expect(phaseOneRoutes.has(item.route), item.route).toBe(false);
    }
  });

  it("has usable beginner content for every phase two route", () => {
    for (const item of phaseTwoAlgorithms) {
      expect(item.summary.length, item.route).toBeGreaterThan(30);
      expect(item.analogy.length, item.route).toBeGreaterThan(25);
      expect(item.history.length, item.route).toBeGreaterThan(30);
      expect(item.purpose.length, item.route).toBeGreaterThan(30);
      expect(item.useCases.length, item.route).toBeGreaterThanOrEqual(2);
      expect(item.avoidFor.length, item.route).toBeGreaterThanOrEqual(2);
      expect(item.steps.length, item.route).toBeGreaterThanOrEqual(3);
      expect(item.workedExample.trace.length, item.route).toBeGreaterThanOrEqual(3);
      expect(item.pseudocode.length, item.route).toBeGreaterThanOrEqual(3);
      expect(item.securityProperties.length, item.route).toBeGreaterThanOrEqual(2);
      expect(item.implementationMistakes.length, item.route).toBeGreaterThanOrEqual(3);
      expect(item.attacks.length, item.route).toBeGreaterThanOrEqual(1);
      expect(item.references.length, item.route).toBeGreaterThanOrEqual(1);
      expect(item.quiz[0].options[item.quiz[0].correctIndex], item.route).toBe(item.recommendation);
    }
  });

  it("keeps unsafe phase two content visibly bounded", () => {
    for (const item of phaseTwoAlgorithms.filter((entry) => ["Broken", "Deprecated", "Educational only"].includes(entry.securityStatus))) {
      expect(item.recommendation.toLowerCase(), item.route).toMatch(/learning|migration|defensive|do not/);
    }
  });
});
