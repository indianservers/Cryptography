import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { caesarCandidates, caesarShift } from "../../../lib/attacks";

const samplePlaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

export default function CaesarBruteForcePage() {
  const [ciphertext, setCiphertext] = useState(caesarShift(samplePlaintext, 3));
  const candidates = useMemo(() => caesarCandidates(ciphertext), [ciphertext]);
  const best = candidates[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Caesar Brute Force" category="Cryptanalysis and Attacks" status="Educational">
        Try every Caesar key, score each candidate for English-like text, and inspect the complete shift table.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Ciphertext">
          <Field label="Ciphertext">
            <textarea className="field min-h-36 font-mono" value={ciphertext} onChange={(event) => setCiphertext(event.target.value)} />
          </Field>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => setCiphertext(caesarShift(samplePlaintext, 3))}>Load shift-3 sample</button>
            <button className="btn" type="button" onClick={() => setCiphertext("")}>Clear</button>
          </div>
        </Card>

        <Card title="Best candidate">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="success">Likely correct answer</StatusPill>
              <StatusPill tone="success">Best shift: {best?.shift ?? 0}</StatusPill>
              <StatusPill tone="info">Score: {best?.score ?? 0}</StatusPill>
            </div>
            <ValueRow label="Likely plaintext" value={best?.plaintext ?? ""} />
          </div>
        </Card>
      </div>

      <Card title="All candidate shifts">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Rank</th><th className="p-2 text-left">Shift</th><th className="p-2 text-left">Score</th><th className="p-2 text-left">Plaintext</th></tr></thead>
            <tbody>
              {candidates.map((candidate, index) => (
                <tr key={candidate.shift} className={`border-t border-slate-100 ${index === 0 ? "bg-emerald-50 ring-1 ring-inset ring-emerald-200" : ""}`}>
                  <td className="p-2 font-mono">{index + 1}{index === 0 && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">best</span>}</td>
                  <td className="p-2 font-mono">{candidate.shift}</td>
                  <td className="p-2 font-mono">{candidate.score}</td>
                  <td className="p-2 font-mono">{candidate.plaintext}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
