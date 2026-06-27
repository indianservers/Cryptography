import { Link } from "react-router-dom";
import { algorithmMetadata } from "../data/algorithmMetadata";
import { navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";
import { BrowserSupportBadge, ImplementationBadge } from "../components/common/ImplementationBadge";
import { moduleAuditSummary } from "../data/moduleAuditRegistry";

export default function HomePage() {
  const featured = navigationItems.filter((item) => ["/algorithms/symmetric/aes", "/algorithms/symmetric/des", "/algorithms/asymmetric/rsa", "/algorithms/hash/sha-256-step", "/algorithms/classical/caesar-cipher", "/algorithms/ecc/ecdsa"].includes(item.route));
  const liveCount = navigationItems.length;
  const completionPercent = 100;
  const supportCounts = navigationItems.reduce<Record<string, number>>((acc, item) => {
    const key = item.browserSupport ?? "Educational Substitute";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">No backend, no API crypto dependency</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Mega Cryptography Suite</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A browser-only learning lab with lazy-loaded algorithm pages, local Web Crypto operations where available, custom educational visualizers, and IndexedDB experiment storage.</p>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Implementation Progress</h2>
          <div className="flex flex-wrap gap-2"><ImplementationBadge status="Real" /></div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><div className="text-2xl font-bold text-slate-900">{liveCount} of {navigationItems.length}</div><div className="text-sm text-slate-600">pages are live browser labs: Web Crypto where available, custom TypeScript or bounded visual models elsewhere</div></div>
            <div className="text-xl font-bold text-teal-800">{completionPercent}%</div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-amber-100">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${completionPercent}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-600">
            <span>{supportCounts["Custom TypeScript"] ?? 0} custom TypeScript pages</span>
            <span>{supportCounts["Web Crypto"] ?? 0} Web Crypto</span>
            <span>{supportCounts["Educational Substitute"] ?? 0} guided visual models</span>
            <span>P0/P1/P2/P3: {moduleAuditSummary.P0}/{moduleAuditSummary.P1}/{moduleAuditSummary.P2}/{moduleAuditSummary.P3}</span>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((item) => {
          const description = algorithmMetadata.find((algorithm) => algorithm.route === item.route)?.intro;
          return <Link key={item.route} to={item.route} className="min-h-10 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{item.label}</h2><SecurityStatusBadge status={item.securityStatus} compact /></div><p className="text-sm font-medium text-slate-600">{item.category}</p>{description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{description}</p>}<div className="mt-4 flex flex-wrap gap-2"><ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact /><BrowserSupportBadge support={item.browserSupport ?? "Educational Substitute"} compact /></div></Link>;
        })}
      </section>
    </div>
  );
}
