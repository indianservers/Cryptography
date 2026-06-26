import { describe, expect, it } from "vitest";
import { algorithmMetadata } from "../src/data/algorithmMetadata";
import { moduleAuditRegistry } from "../src/data/moduleAuditRegistry";
import { navigationItems } from "../src/data/navigation";
import { routeSmokeList } from "../src/data/routeSmokeList";
import { isExactImplementation, shouldShowSecretInputWarning } from "../src/lib/auditStatus";

describe("route smoke registry", () => {
  it("has one smoke entry for every navigation route", () => {
    const navigationRoutes = new Set(navigationItems.map((item) => item.route));
    const smokeRoutes = new Set(routeSmokeList.map((item) => item.route));

    expect(smokeRoutes.size).toBe(navigationRoutes.size);
    for (const route of navigationRoutes) {
      expect(smokeRoutes.has(route), route).toBe(true);
    }
  });

  it("has audit entries for every smoke route", () => {
    for (const route of routeSmokeList.map((item) => item.route)) {
      const entry = moduleAuditRegistry[route];
      expect(entry, route).toBeTruthy();
      expect(entry.priority, route).toMatch(/^P[0-3]$/);
      expect(entry.phaseTarget, route).toBeGreaterThanOrEqual(2);
      expect(entry.implementationAccuracy, route).toBeTruthy();
      expect(entry.verificationStatus, route).toBeTruthy();
    }
  });

  it("has metadata for all non-demo navigation routes except intentional utility-only entries", () => {
    const metadataRoutes = new Set(algorithmMetadata.map((item) => item.route));
    const utilityOnly = new Set(["/algorithms/tools/audit", "/algorithms/tools/test-vectors", "/algorithms/symmetric/aes-rounds", "/algorithms/symmetric/aes-test-vectors"]);

    for (const item of navigationItems) {
      if (item.route.startsWith("/demos/") || utilityOnly.has(item.route)) continue;
      expect(metadataRoutes.has(item.route), item.route).toBe(true);
    }
  });

  it("has explicit Phase 2 decisions for every P0 route", () => {
    const p0Entries = Object.values(moduleAuditRegistry).filter((entry) => entry.priority === "P0");
    expect(p0Entries.length).toBeGreaterThan(0);
    for (const entry of p0Entries) {
      expect(entry.phase2Decision, entry.route).not.toBe("not-p0");
      expect(entry.requiredFix.length, entry.route).toBeGreaterThan(20);
      expect(entry.notes.length, entry.route).toBeGreaterThan(10);
    }
  });

  it("keeps conceptual/deferred P0 pages from claiming exactness", () => {
    for (const entry of Object.values(moduleAuditRegistry).filter((item) => item.priority === "P0")) {
      if (entry.phase2Decision === "conceptual-only" || entry.phase2Decision === "deferred-needs-library") {
        expect(isExactImplementation(entry.implementationAccuracy), entry.route).toBe(false);
      }
    }
  });

  it("requires evidence for exact P0 pages", () => {
    for (const entry of Object.values(moduleAuditRegistry).filter((item) => item.priority === "P0" && isExactImplementation(item.implementationAccuracy))) {
      expect(["HAS_BASIC_UNIT_TESTS", "HAS_OFFICIAL_TEST_VECTORS"].includes(entry.verificationStatus), entry.route).toBe(true);
      expect(entry.requiredTests.filter((test) => !/route smoke|audit registry/i.test(test)).length, entry.route).toBeGreaterThan(0);
    }
  });

  it("marks secret-risk P0 pages as warning-enabled", () => {
    const secretRisk = Object.values(moduleAuditRegistry).filter((entry) => entry.priority === "P0" && entry.securityUseStatus === "SECRET_INPUT_RISK");
    expect(secretRisk.length).toBeGreaterThan(0);
    for (const entry of secretRisk) {
      expect(shouldShowSecretInputWarning(entry), entry.route).toBe(true);
    }
  });
});
