import type { SecurityStatus } from "../../types";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { useLocation } from "react-router-dom";
import { findAlgorithm } from "../../data/algorithmMetadata";
import { getBrowserSupport, getImplementationStatus } from "../../data/implementationStatus";
import { BrowserSupportBadge, ImplementationBadge } from "./ImplementationBadge";
import { AlgorithmSpecificEnhancements } from "./AlgorithmSpecificEnhancements";

const categoryTone = (category: string) => {
  if (/symmetric|block/i.test(category)) return "border-teal-200 bg-teal-50 text-teal-800";
  if (/stream/i.test(category)) return "border-cyan-200 bg-cyan-50 text-cyan-800";
  if (/public|rsa|elgamal|rabin/i.test(category)) return "border-indigo-200 bg-indigo-50 text-indigo-800";
  if (/curve|ecc|ecd/i.test(category)) return "border-violet-200 bg-violet-50 text-violet-800";
  if (/hash/i.test(category)) return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800";
  if (/mac/i.test(category)) return "border-rose-200 bg-rose-50 text-rose-800";
  if (/derivation|kdf/i.test(category)) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (/attack|cryptanalysis/i.test(category)) return "border-red-200 bg-red-50 text-red-800";
  if (/padding/i.test(category)) return "border-amber-200 bg-amber-50 text-amber-900";
  if (/encoding/i.test(category)) return "border-lime-200 bg-lime-50 text-lime-800";
  return "border-sky-200 bg-sky-50 text-sky-800";
};

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
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryTone(category)}`}>{category}</span>
        <SecurityStatusBadge status={status} />
        <ImplementationBadge status={getImplementationStatus(route)} />
        <BrowserSupportBadge support={getBrowserSupport(route)} />
      </div>
      <h1 className="text-2xl font-bold tracking-normal text-ink sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-4xl text-slate-600">{children}</p>
      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Key inputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.inputs ?? ["Inputs vary by page"]).slice(0, 5).map((input) => <span key={input} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm">{input}</span>)}</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs font-semibold uppercase text-slate-500">Outputs</div>
          <div className="mt-2 flex flex-wrap gap-1.5">{(algorithm?.outputs ?? ["Computed result"]).slice(0, 5).map((output) => <span key={output} className="rounded border border-teal-100 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-900 shadow-sm">{output}</span>)}</div>
        </div>
        <div className={`rounded-md border p-3 text-sm ${status === "Modern" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <div className="text-xs font-semibold uppercase">Safe/unsafe warning</div>
          <p className="mt-1">{safeMessage}</p>
        </div>
      </div>
      <nav className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 text-sm">
        {["Overview", "Interactive Demo", "Step-by-Step", "Security Notes", "Test Vectors"].map((tab) => <a key={tab} href={`#${tab.toLowerCase().replace(/[^a-z]+/g, "-").replace(/-$/, "")}`} className="shrink-0 rounded-md border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400">{tab}</a>)}
      </nav>
      <AlgorithmSpecificEnhancements title={title} category={category} status={status} />
    </header>
  );
}
