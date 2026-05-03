import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { vigenere } from "../../../lib/classical";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function VigenereCipherPage() {
  const [plain, setPlain] = useState("ATTACK AT DAWN");
  const [keyword, setKeyword] = useState("LEMON");
  const cipher = useMemo(() => vigenere(plain, keyword), [plain, keyword]);
  const cleanKey = keyword.replace(/[^a-z]/gi, "").toUpperCase() || "KEY";
  let keyIndex = 0;
  const rows = plain.split("").map((char, index) => {
    if (!/[a-z]/i.test(char)) return { index, char, key: "", shift: "", out: char };
    const key = cleanKey[keyIndex++ % cleanKey.length];
    const shift = alphabet.indexOf(key);
    return { index, char, key, shift: String(shift), out: vigenere(char, key) };
  });

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
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="Ciphertext" value={cipher} />
            <ValueRow label="Decrypt with repeated keyword" value={vigenere(cipher, keyword, true)} />
          </div>
        </Card>
      </div>
      <Card title="Character-by-character transformation">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Index</th><th className="p-2 text-left">Plain</th><th className="p-2 text-left">Key</th><th className="p-2 text-left">Shift</th><th className="p-2 text-left">Cipher</th></tr></thead>
            <tbody>{rows.map((row) => <tr key={row.index} className="border-t border-slate-100"><td className="p-2 font-mono">{row.index}</td><td className="p-2 font-mono">{row.char}</td><td className="p-2 font-mono">{row.key}</td><td className="p-2 font-mono">{row.shift}</td><td className="p-2 font-mono">{row.out}</td></tr>)}</tbody>
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
