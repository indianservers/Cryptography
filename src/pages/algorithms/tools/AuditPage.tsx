import { Link } from "react-router-dom";
import { navigationCategories, navigationItems } from "../../../data/navigation";
import { BrowserSupportBadge, ImplementationBadge } from "../../../components/common/ImplementationBadge";
import { SecurityStatusBadge } from "../../../components/common/SecurityStatusBadge";
import { PageHeader } from "../../../components/common/PageHeader";

export default function AuditPage() {
  const real = navigationItems.filter((item) => item.implementationStatus === "Real").length;
  const substitute = navigationItems.length - real;
  const unsafe = navigationItems.filter((item) => item.securityStatus === "Unsafe" || item.securityStatus === "Deprecated").length;
  const webCrypto = navigationItems.filter((item) => item.browserSupport === "Web Crypto").length;
  const custom = navigationItems.filter((item) => item.browserSupport === "Custom TypeScript").length;
  const educational = navigationItems.filter((item) => item.browserSupport === "Educational Substitute").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Implementation Audit" category="Benchmark and Comparison" status="Educational">Track which pages are production browser primitives, real educational math, browser substitutes, or still substitute-backed.</PageHeader>
      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-5"><div className="text-3xl font-bold text-emerald-900">{real}</div><div className="text-sm text-emerald-800">real implementations</div></div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-5"><div className="text-3xl font-bold text-amber-900">{substitute}</div><div className="text-sm text-amber-800">educational substitutes</div></div>
        <div className="rounded-md border border-rose-200 bg-rose-50 p-5"><div className="text-3xl font-bold text-rose-900">{unsafe}</div><div className="text-sm text-rose-800">unsafe/deprecated topics</div></div>
        <div className="rounded-md border border-indigo-200 bg-indigo-50 p-5"><div className="text-3xl font-bold text-indigo-900">{webCrypto}</div><div className="text-sm text-indigo-800">Web Crypto primitives</div></div>
        <div className="rounded-md border border-sky-200 bg-sky-50 p-5"><div className="text-3xl font-bold text-sky-900">{custom}</div><div className="text-sm text-sky-800">custom TypeScript logic</div></div>
        <div className="rounded-md border border-orange-200 bg-orange-50 p-5"><div className="text-3xl font-bold text-orange-900">{educational}</div><div className="text-sm text-orange-800">browser substitutes</div></div>
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
        <h2 className="mb-4 text-lg font-semibold">Page Inventory</h2>
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Page</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Implementation</th><th className="p-2 text-left">Support</th><th className="p-2 text-left">Security</th></tr></thead>
            <tbody>{navigationItems.map((item) => <tr key={item.route} className="border-t border-slate-100"><td className="p-2"><Link className="font-semibold text-cyan-700 hover:text-cyan-900" to={item.route}>{item.label}</Link></td><td className="p-2">{item.category}</td><td className="p-2"><ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact /></td><td className="p-2"><BrowserSupportBadge support={item.browserSupport ?? "Educational Substitute"} compact /></td><td className="p-2"><SecurityStatusBadge status={item.securityStatus} compact /></td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
