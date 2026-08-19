import { describe, expect, it } from "vitest";
import { addedGlossaryTermCount, getGlossaryDefinition, glossaryTerms, glossaryWordCount, originalGlossaryTermCount } from "../src/data/glossaryTerms";

describe("inline glossary popovers", () => {
  it("defines the requested beginner terms", () => {
    for (const term of ["nonce", "IV", "MAC", "AEAD", "salt", "tag", "preimage", "certificate"]) {
      const definition = getGlossaryDefinition(term);
      expect(definition, term).toBeTruthy();
      expect(definition?.shortDefinition.length, term).toBeGreaterThan(10);
      expect(definition?.details.length, term).toBeGreaterThan(80);
      expect(definition?.example.length, term).toBeGreaterThan(20);
    }
  });

  it("contains at least 200 words of explanatory glossary content", () => {
    expect(glossaryWordCount()).toBeGreaterThanOrEqual(200);
  });

  it("has aliases for common phrases learners will see in algorithm pages", () => {
    const aliases = glossaryTerms.flatMap((definition) => definition.aliases.map((alias) => alias.toLowerCase()));
    expect(aliases).toContain("authentication tag");
    expect(aliases).toContain("initialization vector");
    expect(aliases).toContain("message authentication code");
    expect(aliases).toContain("x.509 certificate");
  });

  it("adds 300 more unique cryptography, security, and network glossary terms", () => {
    expect(originalGlossaryTermCount).toBe(8);
    expect(addedGlossaryTermCount).toBeGreaterThanOrEqual(300);
    expect(glossaryTerms.length).toBeGreaterThanOrEqual(308);
    expect(new Set(glossaryTerms.map((definition) => definition.term.toLowerCase())).size).toBe(glossaryTerms.length);
  });

  it("includes important expanded terms across the requested domains", () => {
    for (const term of ["Zero trust", "TLS handshake", "DNSSEC", "Post-quantum cryptography", "Certificate authority", "Firewall", "SQL injection", "Forward secrecy"]) {
      expect(getGlossaryDefinition(term), term).toBeTruthy();
    }
  });
});
