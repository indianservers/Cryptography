import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill } from "../../../components/common/Field";
import { BrowserSupportBadge, ImplementationBadge } from "../../../components/common/ImplementationBadge";
import { SecurityStatusBadge } from "../../../components/common/SecurityStatusBadge";
import { navigationItems } from "../../../data/navigation";
import type { BrowserSupport, ImplementationStatus, SecurityStatus } from "../../../types";

const securityScore: Record<SecurityStatus, number> = { Modern: 5, Legacy: 3, Educational: 2, Deprecated: 1, Unsafe: 0 };
const implementationScore: Record<ImplementationStatus, number> = { Real: 2, Educational: 1, Substitute: 0 };
const supportScore: Record<BrowserSupport, number> = { "Web Crypto": 2, "Custom TypeScript": 1.5, Mixed: 1, "Educational Substitute": 0 };

function strengthScore(item: (typeof navigationItems)[number]) {
  const security = securityScore[item.securityStatus] * 14;
  const implementation = implementationScore[item.implementationStatus ?? "Substitute"] * 10;
  const support = supportScore[item.browserSupport ?? "Educational Substitute"] * 7;
  const bonus = item.securityStatus === "Modern" ? 10 : item.securityStatus === "Unsafe" ? -18 : item.securityStatus === "Legacy" ? -4 : 0;
  return Math.max(0, Math.min(100, Math.round(security + implementation + support + bonus)));
}

function strengthLabel(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 65) return "Contextual";
  if (score >= 45) return "Learning";
  if (score >= 25) return "Weak";
  return "Avoid";
}

export default function AlgorithmComparisonPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [minimum, setMinimum] = useState(0);
  const categories = useMemo(() => ["All", ...Array.from(new Set(navigationItems.map((item) => item.category)))], []);
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return navigationItems
      .map((item) => ({ item, score: strengthScore(item) }))
      .filter(({ item, score }) => (category === "All" || item.category === category) && score >= minimum && (!needle || item.label.toLowerCase().includes(needle) || item.category.toLowerCase().includes(needle)))
      .sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));
  }, [category, minimum, query]);

  return (
    <div className="space-y-6">
      <PageHeader title="Algorithm Strength Comparison" category="Benchmark and Comparison" status="Educational">
        Rank suite modules by a practical learning score that combines security status, implementation maturity, browser support, and common misuse risk.
      </PageHeader>

      <Card title="Filters">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Search"><input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="AES, RSA, hash, attack..." /></Field>
          <Field label="Category"><select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Minimum score"><input className="field font-mono" type="number" min={0} max={100} value={minimum} onChange={(event) => setMinimum(Number(event.target.value))} /></Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill tone="info">{rows.length} results</StatusPill>
          <StatusPill tone="success">{rows.filter((row) => row.score >= 85).length} strong</StatusPill>
          <StatusPill tone="warning">{rows.filter((row) => row.item.securityStatus !== "Modern").length} need context</StatusPill>
        </div>
      </Card>

      <Card title="Strength matrix">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Score</th><th className="p-2 text-left">Algorithm</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Security</th><th className="p-2 text-left">Implementation</th><th className="p-2 text-left">Browser</th></tr></thead>
            <tbody>
              {rows.map(({ item, score }) => (
                <tr key={item.route} className="border-t border-slate-100">
                  <td className="min-w-44 p-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold"><span>{strengthLabel(score)}</span><span className="font-mono">{score}</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${score >= 85 ? "bg-emerald-600" : score >= 65 ? "bg-teal-600" : score >= 45 ? "bg-amber-500" : "bg-red-600"}`} style={{ width: `${score}%` }} /></div>
                  </td>
                  <td className="p-2 font-semibold">{item.label}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2"><SecurityStatusBadge status={item.securityStatus} compact /></td>
                  <td className="p-2"><ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact /></td>
                  <td className="p-2"><BrowserSupportBadge support={item.browserSupport ?? "Educational Substitute"} compact /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
