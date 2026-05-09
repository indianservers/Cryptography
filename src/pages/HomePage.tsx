import { Link } from "react-router-dom";
import { navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";
import { BrowserSupportBadge, ImplementationBadge } from "../components/common/ImplementationBadge";

export default function HomePage() {
  const featured = navigationItems.filter((item) => ["/algorithms/symmetric/aes", "/algorithms/symmetric/des", "/algorithms/asymmetric/rsa", "/algorithms/hash/sha-256-step", "/algorithms/classical/caesar-cipher", "/algorithms/ecc/ecdsa"].includes(item.route));
  const realCount = navigationItems.filter((item) => item.implementationStatus === "Real").length;
  const substituteCount = navigationItems.length - realCount;
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
          <div className="flex flex-wrap gap-2"><ImplementationBadge status="Real" /><ImplementationBadge status="Substitute" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4"><div className="text-2xl font-bold text-emerald-900">{realCount}</div><div className="text-sm text-emerald-800">real pages</div></div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4"><div className="text-2xl font-bold text-amber-900">{substituteCount}</div><div className="text-sm text-amber-800">educational substitute pages</div></div>
          <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4"><div className="text-2xl font-bold text-indigo-900">{supportCounts["Web Crypto"] ?? 0}</div><div className="text-sm text-indigo-800">Web Crypto pages</div></div>
          <div className="rounded-md border border-sky-200 bg-sky-50 p-4"><div className="text-2xl font-bold text-sky-900">{supportCounts["Custom TypeScript"] ?? 0}</div><div className="text-sm text-sky-800">custom TS visualizers</div></div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((item) => <Link key={item.route} to={item.route} className="min-h-10 rounded-md border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{item.label}</h2><SecurityStatusBadge status={item.securityStatus} compact /></div><p className="text-sm text-slate-600">{item.category}</p><div className="mt-4 flex flex-wrap gap-2"><ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact /><BrowserSupportBadge support={item.browserSupport ?? "Educational Substitute"} compact /></div></Link>)}
      </section>
    </div>
  );
}
