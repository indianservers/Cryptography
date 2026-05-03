import type { SecurityStatus } from "../../types";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { useLocation } from "react-router-dom";
import { findAlgorithm } from "../../data/algorithmMetadata";
import { getBrowserSupport, getImplementationStatus } from "../../data/implementationStatus";
import { BrowserSupportBadge, ImplementationBadge } from "./ImplementationBadge";

export function PageHeader({ title, category, status, children }: { title: string; category: string; status: SecurityStatus; children: React.ReactNode }) {
  const location = useLocation();
  const route = findAlgorithm(location.pathname)?.route ?? location.pathname;
  return (
    <header className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{category}</span>
        <SecurityStatusBadge status={status} />
        <ImplementationBadge status={getImplementationStatus(route)} />
        <BrowserSupportBadge support={getBrowserSupport(route)} />
      </div>
      <h1 className="text-3xl font-bold tracking-normal text-ink">{title}</h1>
      <p className="mt-3 max-w-4xl text-slate-600">{children}</p>
    </header>
  );
}
