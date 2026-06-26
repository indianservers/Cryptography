import { describe, expect, it } from "vitest";
import { getModuleArchetype, moduleArchetypeRegistry, moduleArchetypes, p2ArchetypeRoutes } from "../src/data/moduleArchetypes";
import { moduleAuditEntries, moduleAuditRegistry } from "../src/data/moduleAuditRegistry";
import { shouldShowSecretInputWarning } from "../src/lib/auditStatus";

const requiredFields = [
  "preferredInputLayout",
  "outputStyle",
  "needsSecretWarningZone",
  "needsConceptualBoundaryZone",
  "needsStepControls",
  "needsPresetBar",
  "needsMobileActionBar",
  "needsScrollableOutput",
  "commonSections",
  "mobileNotes",
  "accessibilityNotes",
] as const;

describe("module archetypes", () => {
  it("defines required fields for every archetype", () => {
    for (const archetype of Object.values(moduleArchetypes)) {
      for (const field of requiredFields) {
        expect(archetype[field], `${archetype.type}.${field}`).toBeDefined();
      }
      expect(archetype.commonSections.length, archetype.type).toBeGreaterThan(0);
      expect(archetype.mobileNotes.length, archetype.type).toBeGreaterThan(0);
      expect(archetype.accessibilityNotes.length, archetype.type).toBeGreaterThan(0);
    }
  });

  it("covers every Phase 4 P2 priority module", () => {
    for (const [route, expectedType] of Object.entries(p2ArchetypeRoutes)) {
      const auditEntry = moduleAuditRegistry[route];
      expect(auditEntry, route).toBeTruthy();
      expect(auditEntry.priority, route).toBe("P2");
      expect(moduleArchetypeRegistry[route], route).toBe(expectedType);
      expect(getModuleArchetype(route, auditEntry.category, auditEntry).type, route).toBe(expectedType);
    }
  });

  it("keeps secret-risk archetypes aligned with warning logic", () => {
    for (const entry of moduleAuditEntries) {
      const archetype = getModuleArchetype(entry.route, entry.category, entry);
      if (entry.securityUseStatus === "SECRET_INPUT_RISK") {
        expect(archetype.needsSecretWarningZone, entry.route).toBe(true);
        expect(shouldShowSecretInputWarning(entry), entry.route).toBe(true);
      }
    }
  });

  it("keeps conceptual and deferred routes boundary-aware", () => {
    for (const entry of moduleAuditEntries) {
      const shouldHaveBoundary =
        entry.phase2Decision === "conceptual-only" ||
        entry.phase2Decision === "hybrid-exact-core" ||
        entry.phase2Decision === "deferred-needs-library" ||
        entry.implementationAccuracy === "CONCEPTUAL_PREVIEW" ||
        entry.implementationAccuracy === "PLACEHOLDER_OR_SUBSTITUTE";

      if (shouldHaveBoundary) {
        expect(getModuleArchetype(entry.route, entry.category, entry).needsConceptualBoundaryZone, entry.route).toBe(true);
      }
    }
  });
});
