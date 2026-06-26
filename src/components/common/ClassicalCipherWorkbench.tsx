import { useMemo, useState } from "react";
import { PageHeader } from "./PageHeader";
import { Field, StatusPill } from "./Field";
import { WarningBadge } from "./WarningBadge";
import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { IntermediateStepsPanel } from "./IntermediateStepsPanel";
import { MobileActionBar } from "./MobileActionBar";
import { ModulePageFrame } from "./ModulePageFrame";
import { PresetBar } from "./PresetBar";
import {
  affineDecrypt,
  affineEncrypt,
  columnOrder,
  columnarDecrypt,
  columnarEncrypt,
  gcd,
  hill2Encrypt,
  modInverse,
  playfairEncrypt,
  playfairPrepare,
  playfairSquare,
  railFenceDecrypt,
  railFenceEncrypt,
  substitutionDecrypt,
  substitutionEncrypt,
} from "../../lib/classicalExact";
import type { SecurityStatus } from "../../types";

type ClassicalKind = "affine" | "columnar" | "rail-fence" | "substitution" | "playfair" | "hill";

const defaults: Record<ClassicalKind, Record<string, string>> = {
  affine: { text: "AFFINE CIPHER", a: "5", b: "8" },
  columnar: { text: "WEAREDISCOVERED", keyword: "ZEBRA", padding: "X" },
  "rail-fence": { text: "WEAREDISCOVEREDFLEEATONCE", rails: "3" },
  substitution: { text: "Attack at dawn!", mapping: "QWERTYUIOPASDFGHJKLZXCVBNM" },
  playfair: { text: "HIDETHEGOLDINTHETREESTUMP", keyword: "PLAYFAIR EXAMPLE", filler: "X" },
  hill: { text: "HELP", matrix: "3,3,2,5" },
};

const config: Record<ClassicalKind, { title: string; status: SecurityStatus; intro: string; note: string }> = {
  affine: {
    title: "Affine Cipher",
    status: "Educational",
    intro: "Exact educational Affine cipher over A-Z with multiplier validation, modular inverse, encryption, and decryption.",
    note: "Exact for the classroom A-Z Affine cipher. It is still a classical cipher and not suitable for real confidentiality.",
  },
  columnar: {
    title: "Columnar Transposition",
    status: "Educational",
    intro: "Exact educational columnar transposition using stable keyword ordering, including duplicate keyword letters.",
    note: "Exact for this normalization and padding convention. Spaces and punctuation are removed before the grid is filled.",
  },
  "rail-fence": {
    title: "Rail Fence Cipher",
    status: "Educational",
    intro: "Exact zig-zag rail fence transposition with encryption and decryption for rail counts of two or more.",
    note: "Exact for the standard zig-zag rail fence path. This is a transposition lesson, not real security.",
  },
  substitution: {
    title: "Monoalphabetic Substitution",
    status: "Unsafe",
    intro: "Exact A-Z substitution with 26-unique-letter validation, case preservation, punctuation preservation, and inverse mapping.",
    note: "Exact for a simple monoalphabetic substitution alphabet. Frequency analysis breaks this style of cipher.",
  },
  playfair: {
    title: "Playfair Cipher",
    status: "Educational",
    intro: "Exact educational Playfair encryption with I/J merge, repeated-letter filler handling, odd-length padding, and row/column/rectangle rules.",
    note: "Exact for the common 5x5 I/J-merge convention. Different historical filler conventions may produce different ciphertext.",
  },
  hill: {
    title: "Hill Cipher",
    status: "Educational",
    intro: "Exact educational 2x2 Hill cipher encryption with determinant invertibility validation modulo 26.",
    note: "Exact for 2x2 A-Z Hill encryption. Larger matrices and decryption are Phase 3+ candidates.",
  },
};

const routes: Record<ClassicalKind, string> = {
  affine: "/algorithms/classical/affine-cipher",
  columnar: "/algorithms/classical/columnar-transposition",
  "rail-fence": "/algorithms/classical/rail-fence",
  substitution: "/algorithms/classical/substitution-cipher",
  playfair: "/algorithms/classical/playfair-cipher",
  hill: "/algorithms/classical/hill-cipher",
};

function parseMatrix(value: string): [number, number, number, number] {
  const nums = value.split(/[\s,;]+/).filter(Boolean).map(Number);
  if (nums.length !== 4 || nums.some((num) => !Number.isFinite(num))) throw new Error("Enter four matrix numbers, for example 3,3,2,5.");
  return [nums[0], nums[1], nums[2], nums[3]];
}

export function ClassicalCipherWorkbench({ kind }: { kind: ClassicalKind }) {
  const meta = config[kind];
  const route = routes[kind];
  const [values, setValues] = useState(defaults[kind]);
  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  const reset = () => setValues(defaults[kind]);
  const loadLongerSample = () => setValues((current) => ({ ...current, text: "WE ARE LEARNING CLASSICAL CRYPTOGRAPHY" }));
  const loadInvalidSample = () => {
    if (kind === "affine") setValues({ text: "AFFINE CIPHER", a: "13", b: "8" });
    else if (kind === "substitution") setValues({ text: "Attack at dawn!", mapping: "AAAAAAAAAAAAAAAAAAAAAAAAAA" });
    else if (kind === "rail-fence") setValues({ text: "WEAREDISCOVEREDFLEEATONCE", rails: "1" });
    else if (kind === "hill") setValues({ text: "HELP", matrix: "2,4,2,4" });
    else setValues({ ...defaults[kind], text: "" });
  };

  const result = useMemo(() => {
    try {
      if (kind === "affine") {
        const a = Number(values.a);
        const b = Number(values.b);
        const inverse = modInverse(a, 26);
        return {
          rows: [
            ["Ciphertext", affineEncrypt(values.text, a, b)],
            ["Decrypted round-trip", affineDecrypt(affineEncrypt(values.text, a, b), a, b)],
            ["gcd(a, 26)", String(gcd(a, 26))],
            ["Inverse of a", inverse === null ? "not invertible" : String(inverse)],
          ],
          ok: inverse !== null,
        };
      }
      if (kind === "columnar") {
        const cipher = columnarEncrypt(values.text, values.keyword, values.padding);
        return {
          rows: [
            ["Ciphertext", cipher],
            ["Decrypted grid text", columnarDecrypt(cipher, values.keyword)],
            ["Column read order", columnOrder(values.keyword).join(", ")],
          ],
          ok: true,
        };
      }
      if (kind === "rail-fence") {
        const rails = Number(values.rails);
        const cipher = railFenceEncrypt(values.text, rails);
        return { rows: [["Ciphertext", cipher], ["Decrypted round-trip", railFenceDecrypt(cipher, rails)], ["Rail count", String(rails)]], ok: true };
      }
      if (kind === "substitution") {
        const cipher = substitutionEncrypt(values.text, values.mapping);
        return { rows: [["Ciphertext", cipher], ["Decrypted round-trip", substitutionDecrypt(cipher, values.mapping)], ["Mapping", values.mapping.toUpperCase()]], ok: true };
      }
      if (kind === "playfair") {
        return {
          rows: [
            ["Cipher digraphs", playfairEncrypt(values.text, values.keyword, values.filler).match(/.{1,2}/g)?.join(" ") ?? ""],
            ["Prepared pairs", playfairPrepare(values.text, values.filler).join(" ")],
            ["5x5 square", playfairSquare(values.keyword).join("")],
          ],
          ok: true,
        };
      }
      const matrix = parseMatrix(values.matrix);
      const det = matrix[0] * matrix[3] - matrix[1] * matrix[2];
      return { rows: [["Ciphertext", hill2Encrypt(values.text, matrix)], ["Determinant mod 26", String(((det % 26) + 26) % 26)], ["Matrix", matrix.join(", ")]], ok: true };
    } catch (error) {
      return { rows: [["Input error", error instanceof Error ? error.message : "Could not compute this cipher."]], ok: false };
    }
  }, [kind, values]);

  return (
    <div className="space-y-6">
      <PageHeader title={meta.title} category="Classical Cryptography" status={meta.status}>{meta.intro}</PageHeader>
      <ModulePageFrame route={route} category="Classical Cryptography">
      <PresetBar
        presets={[
          { label: "Beginner sample", description: "Load the standard classroom example.", difficulty: "Beginner", apply: reset },
          { label: "Invalid-key sample", description: "Show validation or failure behavior safely.", difficulty: "Invalid", apply: loadInvalidSample },
          { label: "Longer phrase", description: "Use a longer toy phrase to inspect repeated patterns.", difficulty: "Intermediate", apply: loadLongerSample },
        ]}
      />
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <InputPanel title="Exact educational inputs" description="Use toy classroom values only; these ciphers are not modern security." collapsible={false}>
          <div className="grid gap-3">
            {Object.entries(values).map(([key, value]) => (
              <Field key={key} label={key.replace(/-/g, " ")}>
                <input className="field mt-1 font-mono" value={value} onChange={(event) => set(key, event.target.value)} />
              </Field>
            ))}
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={result.ok ? "success" : "warning"}>{result.ok ? "Valid exact classroom parameters" : "Fix parameters"}</StatusPill>
              <StatusPill tone={meta.status === "Unsafe" ? "error" : "info"}>{meta.status}</StatusPill>
            </div>
          </div>
        </InputPanel>
        <OutputPanel
          title="Final result"
          description="Final text is separated from classroom intermediate values."
          finalOutput={result.rows[0]?.[1] ?? ""}
          intermediate={result.rows.slice(1).map(([label, value]) => ({ label, value }))}
          copyable
          collapsible={false}
        />
      </section>
      <IntermediateStepsPanel
        title="Transformation details"
        compact
        steps={result.rows.map(([label, value]) => ({ label, value }))}
      />
      <MobileActionBar actions={[{ label: "Reset", onClick: reset }, { label: "Longer", onClick: loadLongerSample }]} />
      <WarningBadge>{meta.note}</WarningBadge>
      </ModulePageFrame>
    </div>
  );
}
