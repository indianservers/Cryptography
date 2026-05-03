import type { SecurityStatus } from "../../types";

const styles: Record<SecurityStatus, string> = {
  Modern: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Legacy: "border-amber-200 bg-amber-50 text-amber-700",
  Deprecated: "border-rose-200 bg-rose-50 text-rose-700",
  Educational: "border-sky-200 bg-sky-50 text-sky-700",
  Unsafe: "border-red-200 bg-red-50 text-red-700",
};

export function SecurityStatusBadge({ status, compact = false }: { status: SecurityStatus; compact?: boolean }) {
  return <span className={`shrink-0 rounded-full border font-semibold ${styles[status]} ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}`}>{status}</span>;
}

