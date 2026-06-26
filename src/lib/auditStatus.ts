export const implementationAccuracyValues = [
  "OFFICIAL_OR_WEBCRYPTO",
  "EXACT_EDUCATIONAL",
  "CONCEPTUAL_PREVIEW",
  "PLACEHOLDER_OR_SUBSTITUTE",
  "DEPRECATED_OR_UNSAFE_DEMO",
  "NEEDS_EXPERT_REVIEW",
] as const;

export type ImplementationAccuracy = typeof implementationAccuracyValues[number];

export const securityUseStatusValues = [
  "MODERN_SAFE_WHEN_USED_CORRECTLY",
  "EDUCATIONAL_ONLY",
  "LEGACY",
  "DEPRECATED",
  "UNSAFE",
  "ATTACK_CONCEPT_ONLY",
  "SECRET_INPUT_RISK",
] as const;

export type SecurityUseStatus = typeof securityUseStatusValues[number];

export const verificationStatusValues = [
  "HAS_OFFICIAL_TEST_VECTORS",
  "HAS_BASIC_UNIT_TESTS",
  "MANUAL_QA_REQUIRED",
  "NO_TEST_COVERAGE",
  "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT",
] as const;

export type VerificationStatus = typeof verificationStatusValues[number];

export const browserSupportStatusValues = [
  "WEB_CRYPTO",
  "VETTED_LIBRARY_REQUIRED",
  "CUSTOM_EDUCATIONAL_LOGIC",
  "CONCEPTUAL_ONLY",
  "NOT_IMPLEMENTED_EXACTLY",
] as const;

export type BrowserSupportStatus = typeof browserSupportStatusValues[number];

export interface AuditStatusLike {
  implementationAccuracy: ImplementationAccuracy;
  securityUseStatus: SecurityUseStatus;
  verificationStatus: VerificationStatus;
  browserSupportStatus: BrowserSupportStatus;
  title?: string;
  route?: string;
  category?: string;
}

const accuracyLabels: Record<ImplementationAccuracy, string> = {
  OFFICIAL_OR_WEBCRYPTO: "Official / Web Crypto verified",
  EXACT_EDUCATIONAL: "Exact educational implementation",
  CONCEPTUAL_PREVIEW: "Conceptual preview",
  PLACEHOLDER_OR_SUBSTITUTE: "Substitute / placeholder",
  DEPRECATED_OR_UNSAFE_DEMO: "Deprecated / unsafe demo",
  NEEDS_EXPERT_REVIEW: "Needs expert review",
};

const accuracyTones: Record<ImplementationAccuracy, string> = {
  OFFICIAL_OR_WEBCRYPTO: "border-emerald-200 bg-emerald-50 text-emerald-800",
  EXACT_EDUCATIONAL: "border-cyan-200 bg-cyan-50 text-cyan-800",
  CONCEPTUAL_PREVIEW: "border-blue-200 bg-blue-50 text-blue-800",
  PLACEHOLDER_OR_SUBSTITUTE: "border-amber-200 bg-amber-50 text-amber-900",
  DEPRECATED_OR_UNSAFE_DEMO: "border-red-200 bg-red-50 text-red-800",
  NEEDS_EXPERT_REVIEW: "border-violet-200 bg-violet-50 text-violet-800",
};

export function getAccuracyLabel(status: ImplementationAccuracy) {
  return accuracyLabels[status];
}

export function getAccuracyTone(status: ImplementationAccuracy) {
  return accuracyTones[status];
}

export function getSecurityWarning(status: SecurityUseStatus) {
  const warnings: Record<SecurityUseStatus, string> = {
    MODERN_SAFE_WHEN_USED_CORRECTLY: "Use only with correct parameters, unique nonces or IVs where required, and vetted protocol context.",
    EDUCATIONAL_ONLY: "Educational only. Do not treat this page as production cryptography.",
    LEGACY: "Legacy algorithm or mode. Prefer modern primitives for new systems.",
    DEPRECATED: "Deprecated. Keep for study, migration, or compatibility checks only.",
    UNSAFE: "Unsafe for real protection. Use only as a learning demo.",
    ATTACK_CONCEPT_ONLY: "Attack concept for authorized learning only. Do not target systems or data you do not own.",
    SECRET_INPUT_RISK: "Do not paste real private keys, wallet secrets, passwords, tokens, certificates, or production secrets.",
  };
  return warnings[status];
}

export function getVerificationLabel(status: VerificationStatus) {
  const labels: Record<VerificationStatus, string> = {
    HAS_OFFICIAL_TEST_VECTORS: "Official vectors present",
    HAS_BASIC_UNIT_TESTS: "Basic tests only",
    MANUAL_QA_REQUIRED: "Manual QA required",
    NO_TEST_COVERAGE: "No test coverage",
    VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT: "Vector required before exact claim",
  };
  return labels[status];
}

export function getVerificationTone(status: VerificationStatus) {
  const tones: Record<VerificationStatus, string> = {
    HAS_OFFICIAL_TEST_VECTORS: "border-emerald-200 bg-emerald-50 text-emerald-800",
    HAS_BASIC_UNIT_TESTS: "border-cyan-200 bg-cyan-50 text-cyan-800",
    MANUAL_QA_REQUIRED: "border-amber-200 bg-amber-50 text-amber-900",
    NO_TEST_COVERAGE: "border-red-200 bg-red-50 text-red-800",
    VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT: "border-violet-200 bg-violet-50 text-violet-800",
  };
  return tones[status];
}

export function isExactImplementation(status: ImplementationAccuracy) {
  return status === "OFFICIAL_OR_WEBCRYPTO" || status === "EXACT_EDUCATIONAL";
}

export function requiresVectorTest(status: ImplementationAccuracy | VerificationStatus) {
  return status === "NEEDS_EXPERT_REVIEW"
    || status === "EXACT_EDUCATIONAL"
    || status === "VECTOR_REQUIRED_BEFORE_CLAIMING_EXACT"
    || status === "MANUAL_QA_REQUIRED"
    || status === "NO_TEST_COVERAGE";
}

export function shouldShowSecretInputWarning(module: Pick<AuditStatusLike, "route" | "title" | "category" | "securityUseStatus">) {
  const text = `${module.route ?? ""} ${module.title ?? ""} ${module.category ?? ""}`.toLowerCase();
  return module.securityUseStatus === "SECRET_INPUT_RISK"
    || /wallet|private|signature|pki|certificate|csr|pem|der|key-format|export|random-bytes|ecdsa|ed25519|x25519|ecdh|rsa|hmac|pbkdf|bcrypt|scrypt|argon|hkdf/.test(text);
}

export function shouldShowEducationalBoundary(module: Pick<AuditStatusLike, "implementationAccuracy" | "securityUseStatus" | "browserSupportStatus">) {
  return !isExactImplementation(module.implementationAccuracy)
    || module.securityUseStatus !== "MODERN_SAFE_WHEN_USED_CORRECTLY"
    || module.browserSupportStatus !== "WEB_CRYPTO";
}
