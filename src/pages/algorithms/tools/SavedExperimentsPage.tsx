import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { deleteExperiment, importExperiments, listExperiments } from "../../../lib/storage";
import type { SavedExperiment } from "../../../types";

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([pretty(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function SavedExperimentsPage() {
  const [experiments, setExperiments] = useState<SavedExperiment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [algorithmFilter, setAlgorithmFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("IndexedDB experiments load locally from this browser profile.");

  const refresh = async () => {
    try {
      const rows = await listExperiments();
      const sorted = rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setExperiments(sorted);
      setSelectedId((current) => current || sorted[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to read IndexedDB experiments.");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const algorithms = useMemo(() => ["All", ...Array.from(new Set(experiments.map((item) => item.algorithm))).sort()], [experiments]);
  const filtered = useMemo(() => experiments.filter((item) => {
    const matchesAlgorithm = algorithmFilter === "All" || item.algorithm === algorithmFilter;
    const text = `${item.title} ${item.algorithm} ${item.createdAt}`.toLowerCase();
    return matchesAlgorithm && text.includes(search.toLowerCase());
  }), [algorithmFilter, experiments, search]);
  const selected = experiments.find((item) => item.id === selectedId) ?? filtered[0];

  const removeSelected = async () => {
    if (!selected) return;
    await deleteExperiment(selected.id);
    setMessage(`Deleted "${selected.title}" from IndexedDB.`);
    setSelectedId("");
    await refresh();
  };

  const importFromJson = async () => {
    try {
      const parsed = JSON.parse(importText) as SavedExperiment | SavedExperiment[];
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const validRows = rows.filter((row) => row.id && row.algorithm && row.title && row.createdAt);
      if (validRows.length !== rows.length) throw new Error("Every imported experiment needs id, algorithm, title, and createdAt fields.");
      await importExperiments(validRows);
      setImportText("");
      setMessage(`Imported ${validRows.length} experiment${validRows.length === 1 ? "" : "s"} into IndexedDB.`);
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import JSON could not be parsed.");
    }
  };

  const copySelected = async () => {
    if (!selected) return;
    await navigator.clipboard?.writeText(pretty(selected));
    setMessage(`Copied "${selected.title}" as JSON.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Experiments" category="Saved Experiments" status="Educational">Review, compare, import, delete, and export experiments stored only in this browser's IndexedDB database.</PageHeader>
      <section className="rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <div className="font-semibold">Local-only storage</div>
        <p className="mt-1">This page reads IndexedDB directly. No backend, no cloud sync, and no API calls are used for experiment data.</p>
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Experiment browser">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="label">Algorithm<select className="field mt-1" value={algorithmFilter} onChange={(event) => setAlgorithmFilter(event.target.value)}>{algorithms.map((algorithm) => <option key={algorithm}>{algorithm}</option>)}</select></label>
            <label className="label">Search<input className="field mt-1" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="title, algorithm, date" /></label>
            <button className="btn self-end" onClick={() => void refresh()}>Refresh</button>
          </div>
          <div className="mt-4 overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100"><tr><th className="p-2 text-left">Title</th><th className="p-2 text-left">Algorithm</th><th className="p-2 text-left">Created</th><th className="p-2 text-left">Steps</th></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className={`cursor-pointer border-t border-slate-100 ${selected?.id === item.id ? "bg-cyan-50" : ""}`} onClick={() => setSelectedId(item.id)}>
                    <td className="p-2 font-semibold">{item.title}</td>
                    <td className="p-2">{item.algorithm}</td>
                    <td className="p-2 font-mono text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="p-2 font-mono">{item.steps.length}</td>
                  </tr>
                ))}
                {!filtered.length && <tr><td className="p-8 text-center text-slate-500" colSpan={4}>No saved experiments match this filter.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Selected experiment JSON">
          {selected ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button className="btn" onClick={() => void copySelected()}>Copy selected</button>
                <button className="btn" onClick={() => downloadJson(`${selected.title.replace(/\W+/g, "-").toLowerCase() || "experiment"}.json`, selected)}>Download selected</button>
                <button className="btn" onClick={removeSelected}>Delete selected</button>
                <button className="btn" onClick={() => downloadJson("mega-crypto-experiments.json", experiments)}>Export all</button>
              </div>
              <pre className="max-h-[32rem] overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{pretty(selected)}</pre>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Saved outputs, inputs, and step traces will appear here after you save an experiment from an algorithm page.</div>
          )}
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Import experiment JSON">
          <textarea className="field min-h-44 font-mono text-xs" value={importText} onChange={(event) => setImportText(event.target.value)} placeholder="Paste one SavedExperiment object or an array of SavedExperiment objects" />
          <div className="mt-3 flex flex-wrap gap-2"><button className="btn" onClick={importFromJson}>Import into IndexedDB</button><button className="btn" onClick={() => setImportText("")}>Clear</button></div>
        </Card>
        <Card title="Learning notes">
          <div className="space-y-3 text-sm text-slate-700">
            <p>Experiments are useful for comparing two runs of the same algorithm, keeping a trace for a lesson, or exporting a reproducible classroom handout.</p>
            <WarningBadge>Deleting removes the IndexedDB record from this browser profile. Export first if you need the data somewhere else.</WarningBadge>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">{message}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}
