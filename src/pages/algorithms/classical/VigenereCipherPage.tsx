import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { vigenere } from "../../../lib/classical";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function VigenereCipherPage() {
  const [plain, setPlain] = useState("ATTACK AT DAWN");
  const [keyword, setKeyword] = useState("LEMON");
  const [activeRow, setActiveRow] = useState(0);
  const cipher = useMemo(() => vigenere(plain, keyword), [plain, keyword]);
  const cleanKey = keyword.replace(/[^a-z]/gi, "").toUpperCase() || "KEY";
  let keyIndex = 0;
  const rows = plain.split("").map((char, index) => {
    if (!/[a-z]/i.test(char)) return { index, char, key: "", shift: "", out: char };
    const key = cleanKey[keyIndex++ % cleanKey.length];
    const shift = alphabet.indexOf(key);
    return { index, char, key, shift: String(shift), out: vigenere(char, key) };
  });
  const active = rows[Math.min(activeRow, Math.max(rows.length - 1, 0))] ?? rows[0];
  const formula = active?.key ? `${active.char.toUpperCase()} + ${active.key} = (${alphabet.indexOf(active.char.toUpperCase())} + ${active.shift}) mod 26 = ${active.out.toUpperCase()}` : "Non-letter characters pass through unchanged.";

  return (
    <div className="space-y-6">
      <PageHeader title="Vigenere Cipher" category="Classical Cryptography" status="Educational">
        A repeated-key polyalphabetic cipher. The page encrypts locally, expands the keyword, and shows each character's Caesar shift.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Message and keyword">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="Keyword"><input className="field font-mono" value={keyword} onChange={(event) => setKeyword(event.target.value)} /></Field>
            <Field label={`Follow key use: row ${Math.min(activeRow + 1, Math.max(rows.length, 1))} of ${Math.max(rows.length, 1)}`}>
              <input className="w-full" type="range" min="0" max={Math.max(rows.length - 1, 0)} value={Math.min(activeRow, Math.max(rows.length - 1, 0))} onChange={(event) => setActiveRow(Number(event.target.value))} />
            </Field>
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="Ciphertext" value={cipher} />
            <ValueRow label="Decrypt with repeated keyword" value={vigenere(cipher, keyword, true)} />
          </div>
        </Card>
      </div>
      <Card title="Current key letter and formula">
        <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
            <div className="text-xs font-semibold uppercase text-amber-800">Active step</div>
            <div className="mt-2 font-mono text-xl">{active?.char || " "} {"+"} {active?.key || "-"} {"->"} {active?.out || " "}</div>
            {active?.key && <div className="mt-3 rounded-md border border-amber-300 bg-white p-3 text-sm text-amber-950"><span className="font-semibold">Key letter in use:</span> <span className="font-mono text-lg font-bold">{active.key}</span> means shift by {active.shift}.</div>}
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase text-slate-500">Shift formula</div>
            <div className="mt-2 rounded-md border border-blue-200 bg-blue-50 p-3 font-mono text-sm text-blue-950">{formula}</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Repeated key aligned with message</div>
            <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs">{rows.map((row, index) => <span key={row.index} title={row.key ? `Plain ${row.char} uses key ${row.key}` : "No key letter used for spaces/punctuation"} className={`rounded border px-2 py-1 ${index === activeRow ? "changed-byte border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300" : row.key ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-100 text-slate-400"}`}>{row.key || "-"}</span>)}</div>
          </div>
        </div>
      </Card>
      <Card title="Character-by-character transformation">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Index</th><th className="p-2 text-left">Plain</th><th className="p-2 text-left">Key</th><th className="p-2 text-left">Shift</th><th className="p-2 text-left">Cipher</th></tr></thead>
            <tbody>{rows.map((row, index) => <tr key={row.index} className={`border-t border-slate-100 ${index === activeRow ? "bg-amber-50 ring-2 ring-inset ring-amber-300" : ""}`}><td className="p-2 font-mono">{row.index}</td><td className="p-2 font-mono">{row.char}</td><td className={`p-2 font-mono ${index === activeRow ? "bg-amber-100 font-bold text-amber-950" : ""}`}>{row.key}</td><td className="p-2 font-mono">{row.shift}</td><td className="p-2 font-mono">{row.out}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <Card title="Tabula recta idea">
        <p className="text-sm text-slate-600">Each key letter selects a Caesar row. For key letter <span className="font-mono">{cleanKey[0]}</span>, A maps to <span className="font-mono">{cleanKey[0]}</span>, B maps to the next letter, and so on modulo 26.</p>
      </Card>
      <WarningBadge>Repeating keywords create periodic structure. Long ciphertexts can leak the key length and then reduce to Caesar-like columns.</WarningBadge>
    </div>
  );
}
