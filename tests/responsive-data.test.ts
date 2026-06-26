import { describe, expect, it } from "vitest";
import { chunkDisplayValue, formatDataBlock, safeCopyLabel } from "../src/lib/displayFormat";

describe("responsive data formatting", () => {
  it("chunks long hex strings without truncating data", () => {
    const value = "0123456789abcdef".repeat(10);
    const chunks = chunkDisplayValue(value, 16);

    expect(chunks.length).toBe(10);
    expect(chunks.join("")).toBe(value);
  });

  it("chunks multiline data while preserving line content", () => {
    const value = "abcde\n12345";
    const chunks = chunkDisplayValue(value, 2);

    expect(chunks.join("")).toBe("abcde12345");
    expect(chunks).toEqual(["ab", "cd", "e", "12", "34", "5"]);
  });

  it("preserves secret-risk copy safety flags", () => {
    const formatted = formatDataBlock({ label: "Private key", value: "secret", secretRisk: true });

    expect(formatted.copySafety).toBe("secret-risk");
    expect(formatted.original).toBe("secret");
    expect(safeCopyLabel(formatted.label, true)).toContain("Review");
  });

  it("uses ordinary copy labels for non-secret values", () => {
    expect(safeCopyLabel("Digest", false)).toBe("Copy Digest");
  });
});
