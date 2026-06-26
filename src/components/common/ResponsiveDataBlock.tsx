import { CopyButton } from "./CopyButton";
import { formatDataBlock, safeCopyLabel } from "../../lib/displayFormat";
import type { ExportRiskLevel } from "../../lib/exportSafety";

export function ResponsiveDataBlock({
  label,
  value,
  monospace = true,
  chunkSize = 64,
  copyable = false,
  secretRisk = false,
  riskLevel,
  maxHeight = "16rem",
}: {
  label: string;
  value: string;
  monospace?: boolean;
  chunkSize?: number;
  copyable?: boolean;
  secretRisk?: boolean;
  riskLevel?: ExportRiskLevel;
  maxHeight?: string;
}) {
  const formatted = formatDataBlock({ label, value, chunkSize, secretRisk });
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-600">{formatted.label}</div>
        {copyable && <CopyButton value={formatted.original} label={safeCopyLabel(label, secretRisk)} secretRisk={secretRisk} riskLevel={riskLevel} />}
      </div>
      {secretRisk && <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs font-semibold text-amber-900">Review this value before copying. It may represent key material or another sensitive value.</p>}
      <div className={`mt-2 overflow-auto whitespace-pre-wrap break-words rounded border border-white bg-white p-2 text-sm ${monospace ? "font-mono" : ""}`} style={{ maxHeight }}>
        {formatted.chunks.map((chunk, index) => (
          <div key={`${index}-${chunk}`} className="crypto-wrap">{chunk}</div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
        <span>{formatted.original.length} chars</span>
        <span>{new TextEncoder().encode(formatted.original).length} bytes</span>
      </div>
    </div>
  );
}
