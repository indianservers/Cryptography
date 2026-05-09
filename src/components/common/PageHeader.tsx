import type { SecurityStatus } from "../../types";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { useLocation } from "react-router-dom";
import { findAlgorithm } from "../../data/algorithmMetadata";
import { getBrowserSupport, getImplementationStatus } from "../../data/implementationStatus";
import { BrowserSupportBadge, ImplementationBadge } from "./ImplementationBadge";
import { AlgorithmSpecificEnhancements } from "./AlgorithmSpecificEnhancements";

export function PageHeader({ title, category, status, children }: { title: string; category: string; status: SecurityStatus; children: React.ReactNode }) {
  const location = useLocation();
  const algorithm = findAlgorithm(location.pathname);
  const route = algorithm?.route ?? location.pathname;
  const safeMessage = status === "Modern"
    ? "Safe with correct parameters, unique nonces or IVs, and authenticated use where required."
    : status === "Legacy"
      ? "Legacy choice. Prefer a modern primitive for new designs."
      : status === "Deprecated"
        ? "Deprecated. Keep this for study, migration, or compatibility only."
        : "Educational or unsafe if misused. Do not treat demo settings as production guidance.";
  return (
    <header id="overview" className="mb-6 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{category}</span>
        <SecurityStatusBadge status={status} />
        <ImplementationBadge status={getImplementationStatus(route)} />
        <BrowserSupportBadge support={getBrowserSupport(route)} />
      </div>
      <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-4xl text-slate-600">{children}</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Key inputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.inputs ?? ["Inputs vary by page"]).slice(0, 5).map((input) => <span key={input} className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">{input}</span>)}</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Outputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.outputs ?? ["Computed result"]).slice(0, 5).map((output) => <span key={output} className="rounded bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">{output}</span>)}</div>
        </div>
        <div className={`rounded-md border p-3 text-sm ${status === "Modern" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <div className="text-xs font-semibold uppercase">Safe/unsafe warning</div>
          <p className="mt-1">{safeMessage}</p>
        </div>
      </div>
      <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 text-sm">
        {["Overview", "Interactive Demo", "Step-by-Step", "Security Notes", "Test Vectors"].map((tab) => <a key={tab} href={`#${tab.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}`} className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50">{tab}</a>)}
      </nav>
      <AlgorithmSpecificEnhancements title={title} category={category} status={status} />
    </header>
  );
}
