import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const bytesFromText = (value: string) => Array.from(new TextEncoder().encode(value));
const bytesFromHex = (value: string) => {
  const clean = value.replace(/[^0-9a-f]/gi, "");
  return Array.from({ length: Math.floor(clean.length / 2) }, (_, index) => parseInt(clean.slice(index * 2, index * 2 + 2), 16));
};

export default function EntropyAnalyzerPage() {
  const [input, setInput] = useState("Correct Horse Battery Staple 2026!");
  const [comparison, setComparison] = useState("password123");
  const [mode, setMode] = useState("Text");
  const bytes = useMemo(() => mode === "Hex" ? bytesFromHex(input) : bytesFromText(input), [input, mode]);
  const buildStats = (sampleBytes: number[]) => {
    const counts = new Map<number, number>();
    sampleBytes.forEach((byte) => counts.set(byte, (counts.get(byte) ?? 0) + 1));
    const entropy = sampleBytes.length === 0 ? 0 : Array.from(counts.values()).reduce((sum, count) => {
      const p = count / sampleBytes.length;
      return sum - p * Math.log2(p);
    }, 0);
    const rows = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 32);
    return { counts, entropy, rows };
  };
  const stats = useMemo(() => buildStats(bytes), [bytes]);
  const comparisonBytes = useMemo(() => bytesFromText(comparison), [comparison]);
  const comparisonStats = useMemo(() => buildStats(comparisonBytes), [comparisonBytes]);
  const label = stats.entropy >= 4.5 && bytes.length >= 16 ? "Strong sample" : stats.entropy >= 3 && bytes.length >= 10 ? "Medium sample" : "Weak sample";
  const labelTone = label.startsWith("Strong") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : label.startsWith("Medium") ? "border-amber-200 bg-amber-50 text-amber-900" : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className="space-y-6">
      <PageHeader title="Entropy Analyzer" category="Randomness and Entropy" status="Educational">Estimate byte distribution and Shannon entropy for local text or hex input.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Input sample">
          <div className="grid gap-4">
            <Field label="Input mode"><select className="field" value={mode} onChange={(event) => setMode(event.target.value)}><option>Text</option><option>Hex</option></select></Field>
            <Field label="Sample"><textarea className="field min-h-36 font-mono" value={input} onChange={(event) => setInput(event.target.value)} /></Field>
            <Field label="Compare with sample password"><input className="field font-mono" value={comparison} onChange={(event) => setComparison(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Entropy result">
          <div className="grid gap-3 md:grid-cols-3">
            <ValueRow label="Bytes analyzed" value={bytes.length.toString()} />
            <ValueRow label="Unique byte values" value={stats.counts.size.toString()} />
            <ValueRow label="Shannon entropy" value={`${stats.entropy.toFixed(3)} bits/byte`} />
          </div>
          <div className={`mt-4 rounded-md border p-3 text-sm font-semibold ${labelTone}`}>{label}</div>
          <div className="mt-3 grid gap-2 text-xs font-semibold md:grid-cols-3">
            <div className="rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-800">Weak sample</div>
            <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-900">Medium sample</div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-emerald-800">Strong sample</div>
          </div>
          <div className="mt-5 h-3 rounded bg-slate-200"><div className="h-3 rounded bg-cyan-500" style={{ width: `${Math.min(100, (stats.entropy / 8) * 100)}%` }} /></div>
          <p className="mt-3 text-sm text-slate-600">8 bits/byte is the maximum for uniformly distributed byte values. Small samples can look misleadingly weak or strong.</p>
        </Card>
      </div>
      <Card title="Password comparison">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-teal-200 bg-teal-50 p-4 text-teal-950">
            <div className="text-xs font-semibold uppercase">Your sample</div>
            <div className="mt-2 font-mono text-sm">{stats.entropy.toFixed(3)} bits/byte</div>
            <div className="mt-1 text-sm">{bytes.length} bytes, {stats.counts.size} unique byte values</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">Comparison password</div>
            <div className="mt-2 font-mono text-sm">{comparisonStats.entropy.toFixed(3)} bits/byte</div>
            <div className="mt-1 text-sm text-slate-700">{comparisonBytes.length} bytes, {comparisonStats.counts.size} unique byte values</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">Longer, less repetitive samples usually score better here. This is a distribution estimate, so it helps compare examples but does not prove cryptographic randomness.</p>
      </Card>
      <Card title="Symbol frequency table">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Byte</th><th className="p-2 text-left">Count</th><th className="p-2 text-left">Frequency</th><th className="p-2 text-left">Bar</th></tr></thead>
            <tbody>{stats.rows.map(([byte, count]) => <tr key={byte} className="border-t border-slate-100"><td className="p-2 font-mono">0x{byte.toString(16).padStart(2, "0")}</td><td className="p-2 font-mono">{count}</td><td className="p-2 font-mono">{((count / Math.max(1, bytes.length)) * 100).toFixed(2)}%</td><td className="p-2"><div className="h-2 rounded bg-slate-200"><div className="h-2 rounded bg-cyan-500" style={{ width: `${(count / Math.max(1, bytes.length)) * 100}%` }} /></div></td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>This estimates distribution in the visible sample only. It cannot prove that a key source is cryptographically random.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="Entropy analysis" data={{ mode, input, bytes: bytes.length, entropy: stats.entropy, unique: stats.counts.size }} /></div>
      </Card>
    </div>
  );
}
