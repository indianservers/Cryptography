import { describe, expect, it } from "vitest";
import { moduleAuditRegistry } from "../src/data/moduleAuditRegistry";
import { buildExportWarning, canCopyWithoutWarning, classifyExportValue, redactSecretLikeValue } from "../src/lib/exportSafety";

describe("export safety", () => {
  it("classifies secret-like labels and routes as secret-risk", () => {
    expect(classifyExportValue("/algorithms/kdf/pbkdf2", "Derived key", "abc", moduleAuditRegistry["/algorithms/kdf/pbkdf2"])).toBe("secret-risk");
    expect(classifyExportValue("/algorithms/tools/export-center", "Private key", "-----BEGIN PRIVATE KEY-----", moduleAuditRegistry["/algorithms/tools/export-center"])).toBe("secret-risk");
  });

  it("redacts secret-like values", () => {
    expect(redactSecretLikeValue("super-secret-demo-value")).toContain("[redacted");
    expect(redactSecretLikeValue("short")).toBe("[redacted]");
  });

  it("uses the stricter secret warning for conceptual secret-risk outputs", () => {
    const risk = classifyExportValue("/algorithms/padding/oaep", "Preview", "concept", moduleAuditRegistry["/algorithms/padding/oaep"]);
    expect(risk).toBe("secret-risk");
    expect(buildExportWarning(risk, "/algorithms/padding/oaep")).toContain("Review");
  });

  it("allows ordinary educational output copy", () => {
    const risk = classifyExportValue("/algorithms/encoding/base64", "Encoded output", "TWFu", moduleAuditRegistry["/algorithms/encoding/base64"]);
    expect(risk).toBe("safe");
    expect(canCopyWithoutWarning(risk)).toBe(true);
  });
});
