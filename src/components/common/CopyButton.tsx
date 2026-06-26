import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ExportRiskLevel } from "../../lib/exportSafety";
import { buildExportWarning } from "../../lib/exportSafety";

export function CopyButton({ value, label = "Copy output", secretRisk = false, riskLevel }: { value: string; label?: string; secretRisk?: boolean; riskLevel?: ExportRiskLevel }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);
  const resolvedRisk = riskLevel ?? (secretRisk ? "secret-risk" : "safe");
  const disabled = resolvedRisk === "disabled";
  const warning = buildExportWarning(resolvedRisk, "this route");

  useEffect(() => {
    if (!copied) return;
    setToast(true);
    const timeout = window.setTimeout(() => {
      setCopied(false);
      setToast(false);
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <>
      <button
        className={`btn ${copied ? "btn-success" : "btn-primary"}`}
        title={resolvedRisk === "safe" ? label : warning}
        disabled={disabled}
        onClick={async () => {
          await navigator.clipboard?.writeText(value);
          setCopied(true);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : resolvedRisk === "secret-risk" ? "Review before copying" : label}
      </button>
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-50 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg">
          {resolvedRisk === "safe" ? "Copied!" : "Copied with review warning."}
        </div>
      )}
    </>
  );
}
