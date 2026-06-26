export type CopySafety = "normal" | "secret-risk";

export interface FormattedDataBlock {
  label: string;
  chunks: string[];
  original: string;
  copySafety: CopySafety;
}

export function chunkDisplayValue(value: string, chunkSize = 64) {
  if (chunkSize <= 0) return [value];
  if (!value) return [""];
  const normalized = value.replace(/\r\n/g, "\n");
  if (normalized.includes("\n")) {
    return normalized.split("\n").flatMap((line) => line.match(new RegExp(`.{1,${chunkSize}}`, "g")) ?? [""]);
  }
  return normalized.match(new RegExp(`.{1,${chunkSize}}`, "g")) ?? [normalized];
}

export function formatDataBlock({ label, value, chunkSize = 64, secretRisk = false }: { label: string; value: string; chunkSize?: number; secretRisk?: boolean }): FormattedDataBlock {
  return {
    label,
    chunks: chunkDisplayValue(value, chunkSize),
    original: value,
    copySafety: secretRisk ? "secret-risk" : "normal",
  };
}

export function safeCopyLabel(label: string, secretRisk = false) {
  return secretRisk ? `Review before copying ${label}` : `Copy ${label}`;
}
