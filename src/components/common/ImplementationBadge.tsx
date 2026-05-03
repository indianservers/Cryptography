import type { BrowserSupport, ImplementationStatus } from "../../types";

const implementationStyles: Record<ImplementationStatus, string> = {
  Real: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Educational: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Substitute: "border-amber-200 bg-amber-50 text-amber-800",
};

const supportStyles: Record<BrowserSupport, string> = {
  "Web Crypto": "border-indigo-200 bg-indigo-50 text-indigo-800",
  "Custom TypeScript": "border-sky-200 bg-sky-50 text-sky-800",
  "Educational Substitute": "border-amber-200 bg-amber-50 text-amber-800",
  Mixed: "border-violet-200 bg-violet-50 text-violet-800",
};

export function ImplementationBadge({ status, compact = false }: { status: ImplementationStatus; compact?: boolean }) {
  return <span className={`rounded-full border px-2 py-0.5 font-semibold ${compact ? "text-[10px]" : "text-xs"} ${implementationStyles[status]}`}>{status}</span>;
}

export function BrowserSupportBadge({ support, compact = false }: { support: BrowserSupport; compact?: boolean }) {
  return <span className={`rounded-full border px-2 py-0.5 font-semibold ${compact ? "text-[10px]" : "text-xs"} ${supportStyles[support]}`}>{support}</span>;
}
