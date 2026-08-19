import { describe, expect, it } from "vitest";
import { getSecurityStatusExplanation, securityStatusLegendItems } from "../src/components/common/SecurityStatusBadge";

describe("security status badge explanations", () => {
  it("explains every learner-facing status in the legend", () => {
    expect(securityStatusLegendItems).toEqual([
      "Recommended",
      "Acceptable for specific use",
      "Legacy",
      "Deprecated",
      "Broken",
      "Educational only",
    ]);

    for (const status of securityStatusLegendItems) {
      const explanation = getSecurityStatusExplanation(status);
      expect(explanation.label.length, status).toBeGreaterThan(3);
      expect(explanation.description.length, status).toBeGreaterThan(30);
      expect(explanation.useWhen.length, status).toBeGreaterThan(30);
      expect(explanation.avoidWhen.length, status).toBeGreaterThan(30);
      expect(explanation.learnerAction.length, status).toBeGreaterThan(30);
    }
  });

  it("maps existing app statuses to clearer learner language", () => {
    expect(getSecurityStatusExplanation("Modern").label).toBe("Recommended");
    expect(getSecurityStatusExplanation("Unsafe").label).toBe("Broken / unsafe");
    expect(getSecurityStatusExplanation("Educational").label).toBe("Educational only");
  });
});
