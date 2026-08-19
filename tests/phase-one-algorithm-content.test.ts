import { describe, expect, it } from "vitest";
import { algorithmMetadata } from "../src/data/algorithmMetadata";
import { phaseOneAlgorithms } from "../src/data/phaseOneAlgorithmContent";

describe("phase one algorithm content registry", () => {
  it("covers exactly the first 30 unique algorithms for phase one", () => {
    expect(phaseOneAlgorithms).toHaveLength(30);
    expect(new Set(phaseOneAlgorithms.map((item) => item.id)).size).toBe(30);
    expect(new Set(phaseOneAlgorithms.map((item) => item.route)).size).toBe(30);
  });

  it("points every phase one record at an existing algorithm route", () => {
    const existingRoutes = new Set(algorithmMetadata.map((item) => item.route));
    for (const item of phaseOneAlgorithms) {
      expect(existingRoutes.has(item.route), item.name).toBe(true);
    }
  });

  it("has the required beginner-facing content fields", () => {
    for (const item of phaseOneAlgorithms) {
      expect(item.name.trim(), item.id).not.toHaveLength(0);
      expect(item.summary.length, item.id).toBeGreaterThan(40);
      expect(item.analogy.length, item.id).toBeGreaterThan(30);
      expect(item.history.length, item.id).toBeGreaterThan(30);
      expect(item.purpose.length, item.id).toBeGreaterThan(30);
      expect(item.useCases.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.avoidFor.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.inputs.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.outputs.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.parameters.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.keySizes.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.steps.length, item.id).toBeGreaterThanOrEqual(3);
      expect(item.workedExample.trace.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.pseudocode.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.securityProperties.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.advantages.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.limitations.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.implementationMistakes.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.attacks.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.recommendation.length, item.id).toBeGreaterThan(20);
      expect(item.relatedAlgorithms.length, item.id).toBeGreaterThanOrEqual(2);
      expect(item.glossary.length, item.id).toBeGreaterThanOrEqual(3);
      expect(item.quiz.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.references.length, item.id).toBeGreaterThanOrEqual(1);
      expect(item.lastReviewed, item.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("labels unsafe and deprecated phase one algorithms clearly", () => {
    const weak = phaseOneAlgorithms.filter((item) => ["Broken", "Deprecated", "Educational only"].includes(item.securityStatus));
    expect(weak.length).toBeGreaterThan(8);
    for (const item of weak) {
      const warningText = [
        item.summary,
        item.avoidFor.join(" "),
        item.implementationMistakes.join(" "),
        item.recommendation,
      ].join(" ").toLowerCase();
      expect(warningText, item.id).toMatch(/not secure|not a secure|not as protection|real security|real confidentiality|do not|avoid|deprecated|broken|learning|historical|insecure|use only|new systems|migration-only|legacy migration/);
    }
  });
});
