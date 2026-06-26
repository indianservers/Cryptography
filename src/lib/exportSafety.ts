import type { ModuleAuditEntry } from "../data/moduleAuditRegistry";

export type ExportRiskLevel = "safe" | "review" | "secret-risk" | "disabled";

const secretLabel = /private|secret|password|seed|wallet|token|derived|okm|key material|session|credential/i;
const secretValue = /-----BEGIN (?:PRIVATE|ENCRYPTED PRIVATE)|wallet|seed phrase|password|token|secret/i;

export function classifyExportValue(route: string, label: string, value: string, registryEntry?: ModuleAuditEntry): ExportRiskLevel {
  if (!value) return "safe";
  if (/private-key|wallet|export-center|key-format|certificate|csr|pem-der|hmac|pbkdf|hkdf|argon|bcrypt|scrypt/i.test(route)) return "secret-risk";
  if (secretLabel.test(label) || secretValue.test(value)) return "secret-risk";
  if (registryEntry?.securityUseStatus === "SECRET_INPUT_RISK") return "secret-risk";
  if (registryEntry?.securityUseStatus === "ATTACK_CONCEPT_ONLY") return "review";
  if (registryEntry?.implementationAccuracy === "CONCEPTUAL_PREVIEW" || registryEntry?.phase2Decision === "conceptual-only" || registryEntry?.phase2Decision === "deferred-needs-library") return "review";
  return "safe";
}

export function redactSecretLikeValue(value: string) {
  if (!value) return value;
  if (value.length <= 8) return "[redacted]";
  return `${value.slice(0, 4)}...[redacted ${value.length} chars]...${value.slice(-4)}`;
}

export function buildExportWarning(riskLevel: ExportRiskLevel, route: string) {
  if (riskLevel === "disabled") return `Copy/export is disabled for ${route} because the value should not leave the browser.`;
  if (riskLevel === "secret-risk") return "Review before copying or exporting. This may contain key material, passwords, derived secrets, tokens, or private data.";
  if (riskLevel === "review") return "Review before sharing. This output may be conceptual, deprecated, unsafe, or attack-concept-only.";
  return "Safe to copy as educational output, assuming the input was not a real secret.";
}

export function canCopyWithoutWarning(riskLevel: ExportRiskLevel) {
  return riskLevel === "safe";
}
