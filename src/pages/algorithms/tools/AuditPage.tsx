import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { navigationCategories, navigationItems } from "../../../data/navigation";
import { ImplementationBadge } from "../../../components/common/ImplementationBadge";
import { SecurityStatusBadge } from "../../../components/common/SecurityStatusBadge";
import { PageHeader } from "../../../components/common/PageHeader";
import { moduleAuditEntries, moduleAuditSummary } from "../../../data/moduleAuditRegistry";
import { getAccuracyLabel, getVerificationLabel } from "../../../lib/auditStatus";

export default function AuditPage() {
  const [filter, setFilter] = useState("All");
  const live = navigationItems.length;
  const guidedModels = navigationItems.filter((item) => item.browserSupport === "Educational Substitute").length;
  const unsafe = navigationItems.filter((item) => item.securityStatus === "Unsafe" || item.securityStatus === "Deprecated").length;
  const webCrypto = navigationItems.filter((item) => item.browserSupport === "Web Crypto").length;
  const custom = navigationItems.filter((item) => item.browserSupport === "Custom TypeScript").length;
  const educational = navigationItems.filter((item) => item.browserSupport === "Educational Substitute").length;
  const filteredItems = useMemo(() => navigationItems.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Real") return item.implementationStatus === "Real";
    if (filter === "Guided model") return item.browserSupport === "Educational Substitute";
    if (filter === "Unsafe") return item.securityStatus === "Unsafe" || item.securityStatus === "Deprecated";
    if (filter === "Web Crypto") return item.browserSupport === "Web Crypto" || item.browserSupport === "Mixed";
    if (filter === "Custom TypeScript") return item.browserSupport === "Custom TypeScript";
    return true;
  }), [filter]);

  return (
    <div className="space-y-6">
      <PageHeader title="Implementation Audit" category="Benchmark and Comparison" status="Educational">Track live browser modules by Web Crypto support, custom TypeScript logic, guided visual models, safety status, and verification evidence.</PageHeader>
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5"><div className="text-3xl font-bold text-emerald-900">{live}</div><div className="text-sm text-emerald-800">live browser pages</div></div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-5"><div className="text-3xl font-bold text-amber-900">{guidedModels}</div><div className="text-sm text-amber-800">guided visual models</div></div>
        <div className="rounded-md border border-rose-200 bg-rose-50 p-5"><div className="text-3xl font-bold text-rose-900">{unsafe}</div><div className="text-sm text-rose-800">unsafe/deprecated topics</div></div>
        <div className="rounded-md border border-indigo-200 bg-indigo-50 p-5"><div className="text-3xl font-bold text-indigo-900">{webCrypto}</div><div className="text-sm text-indigo-800">Web Crypto primitives</div></div>
        <div className="rounded-md border border-sky-200 bg-sky-50 p-5"><div className="text-3xl font-bold text-sky-900">{custom}</div><div className="text-sm text-sky-800">custom TypeScript logic</div></div>
        <div className="rounded-md border border-orange-200 bg-orange-50 p-5"><div className="text-3xl font-bold text-orange-900">{educational}</div><div className="text-sm text-orange-800">guided visual models</div></div>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {(["P0", "P1", "P2", "P3"] as const).map((priority) => (
          <div key={priority} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{priority} audit priority</div>
            <div className="mt-1 text-2xl font-bold text-slate-900">{moduleAuditSummary[priority]}</div>
          </div>
        ))}
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Category Checklist</h2>
        <div className="space-y-5">
          {navigationCategories.map((category) => {
            const items = navigationItems.filter((item) => item.category === category);
            if (!items.length) return null;
            const done = items.filter((item) => item.implementationStatus === "Real").length;
            return (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-semibold">{category}</h3><span className="font-mono text-sm">{done}/{items.length}</span></div>
                <div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-cyan-500" style={{ width: `${(done / items.length) * 100}%` }} /></div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Page Inventory</h2>
            <p className="mt-1 text-sm text-slate-600">Filter by implementation quality, safety status, and browser primitive coverage.</p>
          </div>
          <label className="label">Audit filter<select className="field mt-1" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Real</option><option>Guided model</option><option>Unsafe</option><option>Web Crypto</option><option>Custom TypeScript</option></select></label>
        </div>
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Page</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Implementation</th><th className="p-2 text-left">Accuracy</th><th className="p-2 text-left">Verification</th><th className="p-2 text-left">Security</th></tr></thead>
            <tbody>{filteredItems.map((item) => {
              const audit = moduleAuditEntries.find((entry) => entry.route === item.route);
              return <tr key={item.route} className="border-t border-slate-100"><td className="p-2"><Link className="font-semibold text-cyan-700 hover:text-cyan-900" to={item.route}>{item.label}</Link></td><td className="p-2">{item.category}</td><td className="p-2"><ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact /></td><td className="p-2 text-xs font-semibold">{audit ? `${audit.priority}: ${getAccuracyLabel(audit.implementationAccuracy)}` : "Missing audit"}</td><td className="p-2 text-xs">{audit ? getVerificationLabel(audit.verificationStatus) : "Missing"}</td><td className="p-2"><SecurityStatusBadge status={item.securityStatus} compact /></td></tr>;
            })}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
