import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { letterFrequency } from "../../../lib/attacks";

const sample = "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj";

export default function FrequencyAnalysisPage() {
  const [ciphertext, setCiphertext] = useState(sample);
  const rows = useMemo(() => letterFrequency(ciphertext).sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter)), [ciphertext]);
  const totalLetters = rows.reduce((sum, row) => sum + row.count, 0);
  const topLetters = rows.slice(0, 6).map((row) => `${row.letter}:${row.count}`).join(", ");

  return (
    <div className="space-y-6">
      <PageHeader title="Frequency Analysis" category="Cryptanalysis and Attacks" status="Educational">
        Count ciphertext letters and compare their distribution against English. This is a real local analysis workflow for substitution-style ciphers and Caesar shifts.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Ciphertext">
          <Field label="Ciphertext">
            <textarea className="field min-h-40 font-mono" value={ciphertext} onChange={(event) => setCiphertext(event.target.value)} />
          </Field>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => setCiphertext(sample)}>Load Caesar sample</button>
            <button className="btn" type="button" onClick={() => setCiphertext("")}>Clear</button>
          </div>
        </Card>

        <Card title="Analysis summary">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="info">{totalLetters} letters</StatusPill>
              <StatusPill tone={totalLetters >= 40 ? "success" : "warning"}>{totalLetters >= 40 ? "Enough text for a rough signal" : "Short sample"}</StatusPill>
            </div>
            <ValueRow label="Top letters" value={topLetters || "none"} />
            <ValueRow label="Likely English anchors" value="E, T, A, O, I, N are common targets for monoalphabetic guesses." />
          </div>
        </Card>
      </div>

      <Card title="Frequency table">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Letter</th><th className="p-2 text-left">Count</th><th className="p-2 text-left">Observed</th><th className="p-2 text-left">English expected</th><th className="p-2 text-left">Bar</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.letter} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{row.letter}</td>
                  <td className="p-2 font-mono">{row.count}</td>
                  <td className="p-2 font-mono">{row.percent.toFixed(2)}%</td>
                  <td className="p-2 font-mono">{row.expected.toFixed(2)}%</td>
                  <td className="min-w-48 p-2"><div className="h-3 rounded bg-slate-100"><div className="h-3 rounded bg-teal-600" style={{ width: `${Math.min(100, row.percent * 5)}%` }} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
