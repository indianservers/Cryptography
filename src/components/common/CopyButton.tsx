import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copy output", secretRisk = false }: { value: string; label?: string; secretRisk?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

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
        title={secretRisk ? "Review this sensitive value before copying." : label}
        onClick={async () => {
          await navigator.clipboard?.writeText(value);
          setCopied(true);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : label}
      </button>
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-50 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg">
          {secretRisk ? "Copied after review." : "Copied!"}
        </div>
      )}
    </>
  );
}
