import { describe, expect, it } from "vitest";
import {
  moduleLearningContent,
  moduleLearningEntries,
  requiredP0LearningRoutes,
  requiredP1LearningRoutes,
  requiredP3LearningRoutes,
} from "../src/data/moduleLearningContent";
import { moduleAuditEntries } from "../src/data/moduleAuditRegistry";

const forbiddenConceptualClaims = [
  "production ready",
  "official",
  "real wallet",
  "real certificate validation",
  "unbreakable",
  "secure by default",
];

function entryText(route: string) {
  const entry = moduleLearningContent[route];
  return [
    entry.objective,
    entry.beginnerTakeaway,
    entry.formulaTitle,
    entry.formula,
    ...entry.variables.flatMap((variable) => [variable.symbol, variable.meaning]),
    ...entry.constraints,
    ...entry.observationPrompts,
    ...entry.expectedPatterns,
    ...entry.misconceptions.flatMap((item) => [item.myth, item.correction]),
    entry.realWorldUse,
    entry.conceptualBoundary ?? "",
    entry.resultInterpretationTemplate ?? "",
    ...entry.checkpointQuestions.flatMap((question) => [question.question, question.explanation, ...question.options]),
  ].join(" ").toLowerCase();
}

describe("module learning content", () => {
  it("covers every Phase 3 P1 priority route", () => {
    for (const route of requiredP1LearningRoutes) {
      expect(moduleLearningContent[route], route).toBeTruthy();
    }
  });

  it("covers Phase 2 exact or hybrid priority routes selected for Phase 3", () => {
    for (const route of requiredP0LearningRoutes) {
      expect(moduleLearningContent[route], route).toBeTruthy();
    }
  });

  it("covers strong custom P3 learning routes", () => {
    for (const route of requiredP3LearningRoutes) {
      expect(moduleLearningContent[route], route).toBeTruthy();
    }
  });

  it("has complete learner-facing fields for each entry", () => {
    expect(moduleLearningEntries.length).toBeGreaterThanOrEqual(45);

    for (const entry of moduleLearningEntries) {
      expect(entry.objective.trim(), entry.route).not.toHaveLength(0);
      expect(entry.beginnerTakeaway.trim(), entry.route).not.toHaveLength(0);
      expect(entry.formula.trim(), entry.route).not.toHaveLength(0);
      expect(entry.variables.length, entry.route).toBeGreaterThanOrEqual(2);
      expect(entry.constraints.length, entry.route).toBeGreaterThanOrEqual(2);
      expect(entry.observationPrompts.length, entry.route).toBeGreaterThanOrEqual(2);
      expect(entry.expectedPatterns.length, entry.route).toBeGreaterThanOrEqual(2);
      expect(entry.misconceptions.length, entry.route).toBeGreaterThanOrEqual(1);
      expect(entry.realWorldUse.trim(), entry.route).not.toHaveLength(0);
      expect(entry.checkpointQuestions.length, entry.route).toBeGreaterThanOrEqual(1);
    }
  });

  it("gives exact Phase 2 P0 routes formulas and misconceptions", () => {
    const exactP0Routes = moduleAuditEntries
      .filter((entry) => entry.priority === "P0" && entry.phase2Decision === "exact-educational")
      .map((entry) => entry.route);

    expect(exactP0Routes.length).toBeGreaterThan(0);

    for (const route of exactP0Routes) {
      const content = moduleLearningContent[route];
      expect(content, route).toBeTruthy();
      expect(content.formula.trim(), route).not.toHaveLength(0);
      expect(content.misconceptions.length, route).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps conceptual or hybrid P0 learning routes inside explicit boundaries", () => {
    const boundedRoutes = requiredP0LearningRoutes.filter((route) => {
      const auditEntry = moduleAuditEntries.find((entry) => entry.route === route);
      return auditEntry?.phase2Decision === "conceptual-only" || auditEntry?.phase2Decision === "hybrid-exact-core";
    });

    expect(boundedRoutes.length).toBeGreaterThan(0);

    for (const route of boundedRoutes) {
      const content = moduleLearningContent[route];
      expect(content?.conceptualBoundary?.trim(), route).toBeTruthy();
      for (const claim of forbiddenConceptualClaims) {
        expect(entryText(route), `${route} contains '${claim}'`).not.toContain(claim);
      }
    }
  });

  it("has valid checkpoint questions", () => {
    for (const entry of moduleLearningEntries) {
      for (const question of entry.checkpointQuestions) {
        expect(question.question.trim(), entry.route).not.toHaveLength(0);
        expect(question.options.length, entry.route).toBeGreaterThanOrEqual(2);
        expect(question.correctIndex, entry.route).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex, entry.route).toBeLessThan(question.options.length);
        expect(question.explanation.trim(), entry.route).not.toHaveLength(0);
      }
    }
  });
});
