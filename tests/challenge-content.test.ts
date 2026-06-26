import { describe, expect, it } from "vitest";
import { moduleChallenges, requiredChallengeRoutes } from "../src/data/moduleChallenges";

describe("challenge content", () => {
  it("covers the minimum challenge route set", () => {
    expect(requiredChallengeRoutes.length).toBeGreaterThanOrEqual(20);
  });

  it("has valid prompts, answers, and explanations", () => {
    for (const challenge of moduleChallenges) {
      expect(challenge.prompt.trim(), challenge.id).not.toHaveLength(0);
      expect(challenge.correctAnswer.trim(), challenge.id).not.toHaveLength(0);
      expect(challenge.explanation.trim(), challenge.id).not.toHaveLength(0);
      expect(challenge.tags.length, challenge.id).toBeGreaterThan(0);
      if (challenge.options) {
        expect(challenge.options.length, challenge.id).toBeGreaterThanOrEqual(2);
        expect(challenge.options, challenge.id).toContain(challenge.correctAnswer);
      }
    }
  });

  it("keeps attack challenges defensive", () => {
    for (const challenge of moduleChallenges.filter((item) => item.route.includes("/attacks/"))) {
      const text = `${challenge.prompt} ${challenge.explanation} ${challenge.exactnessNote ?? ""} ${challenge.tags.join(" ")}`.toLowerCase();
      expect(/defensive|mitigation|uniform|toy|prevent|risk/.test(text), challenge.id).toBe(true);
    }
  });

  it("avoids exactness overclaims", () => {
    const forbidden = ["production ready", "real wallet", "real certificate validation", "unbreakable", "official output", "guaranteed secure"];
    for (const challenge of moduleChallenges) {
      const text = JSON.stringify(challenge).toLowerCase();
      for (const phrase of forbidden) expect(text, `${challenge.id} contains ${phrase}`).not.toContain(phrase);
    }
  });
});
