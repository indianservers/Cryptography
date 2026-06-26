import { describe, expect, it } from "vitest";
import { browserSmokeRoutes } from "../src/data/browserSmokeRoutes";
import { routeSmokeList } from "../src/data/routeSmokeList";
import { moduleAnimationContent } from "../src/data/moduleAnimationContent";
import { moduleLearningContent } from "../src/data/moduleLearningContent";

describe("browser route smoke scaffold", () => {
  it("lists representative render routes that exist in the app", () => {
    const routes = new Set(routeSmokeList.map((item) => item.route));
    for (const item of browserSmokeRoutes) {
      if (item.route === "/") continue;
      expect(routes.has(item.route), item.route).toBe(true);
      expect(item.expectsMainContent, item.route).toBe(true);
      expect(item.mobileOverflowCheck, item.route).toBe(true);
    }
  });

  it("aligns learning and animation expectations with route data", () => {
    for (const item of browserSmokeRoutes) {
      if (item.expectsLearning) expect(moduleLearningContent[item.route], item.route).toBeTruthy();
      if (item.expectsAnimation) expect(moduleAnimationContent[item.route], item.route).toBeTruthy();
    }
  });
});
