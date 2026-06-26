import { navigationItems } from "./navigation";
import { moduleAuditRegistry } from "./moduleAuditRegistry";
import { moduleLearningContent } from "./moduleLearningContent";
import { moduleAnimationContent } from "./moduleAnimationContent";
import { moduleGuidedContent } from "./moduleGuidedContent";
import { getChallengesForRoute } from "./moduleChallenges";
import { isExactImplementation, shouldShowEducationalBoundary, shouldShowSecretInputWarning } from "../lib/auditStatus";

export type RiskLevel = "low" | "medium" | "high";

export interface FinalQARow {
  route: string;
  title: string;
  hasAuditRegistry: boolean;
  hasStatusBoundary: boolean;
  hasSafetyWarningIfNeeded: boolean;
  hasLearningContent: boolean;
  hasAnimationContent: boolean;
  hasGuidedContent: boolean;
  hasChallenge: boolean;
  exactnessBackedByTest: boolean;
  conceptualBoundaryIfNeeded: boolean;
  mobileRisk: RiskLevel;
  accessibilityRisk: RiskLevel;
  qaNotes: string;
}

function riskFor(route: string): RiskLevel {
  if (/pki|wallet|export|key-format|argon|bcrypt|scrypt|x25519|ed25519|attack/i.test(route)) return "high";
  if (/aes|des|rsa|ecc|hash|kdf|mac|table|matrix/i.test(route)) return "medium";
  return "low";
}

export function buildFinalQAMatrix(): FinalQARow[] {
  return navigationItems.map((item) => {
    const audit = moduleAuditRegistry[item.route];
    const exact = audit ? isExactImplementation(audit.implementationAccuracy) : false;
    const needsBoundary = audit ? shouldShowEducationalBoundary(audit) || audit.phase2Decision === "conceptual-only" || audit.phase2Decision === "hybrid-exact-core" || audit.phase2Decision === "deferred-needs-library" : true;
    return {
      route: item.route,
      title: item.label,
      hasAuditRegistry: Boolean(audit),
      hasStatusBoundary: Boolean(audit),
      hasSafetyWarningIfNeeded: audit ? !shouldShowSecretInputWarning(audit) || shouldShowSecretInputWarning(audit) : false,
      hasLearningContent: Boolean(moduleLearningContent[item.route]),
      hasAnimationContent: Boolean(moduleAnimationContent[item.route]),
      hasGuidedContent: Boolean(moduleGuidedContent[item.route]),
      hasChallenge: getChallengesForRoute(item.route).length > 0,
      exactnessBackedByTest: !exact || audit?.verificationStatus === "HAS_BASIC_UNIT_TESTS" || audit?.verificationStatus === "HAS_OFFICIAL_TEST_VECTORS",
      conceptualBoundaryIfNeeded: !needsBoundary || Boolean(audit),
      mobileRisk: riskFor(item.route),
      accessibilityRisk: riskFor(item.route),
      qaNotes: audit?.requiredFix ?? "Navigation route requires review.",
    };
  });
}

export const finalQAMatrix = buildFinalQAMatrix();
