import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { caesar } from "../../../lib/classical";
import { frequency } from "../../../lib/cryptoDemos";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function CaesarCipherPage() {
  const [plain, setPlain] = useState("Defend the east wall");
  const [shift, setShift] = useState(3);
  const cipher = useMemo(() => caesar(plain, shift), [plain, shift]);
  const decrypted = useMemo(() => caesar(cipher, -shift), [cipher, shift]);
  const brute = useMemo(() => Array.from({ length: 26 }, (_, value) => ({ shift: value, text: caesar(cipher, -value) })), [cipher]);
  const counts = useMemo(() => frequency(cipher), [cipher]);
  const mapping = alphabet.split("").map((letter, index) => ({ from: letter, to: alphabet[(index + shift) % 26] }));

  return (
    <div className="space-y-6">
      <PageHeader title="Caesar Cipher" category="Classical Cryptography" status="Educational">
        A fixed alphabet rotation. This page performs real Caesar encryption/decryption, shows the substitution alphabet, and brute forces every possible shift.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Plaintext and shift">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label={`Shift: ${shift}`}><input type="range" min="0" max="25" value={shift} onChange={(event) => setShift(Number(event.target.value))} className="w-full" /></Field>
            <div className="flex gap-2"><button className="btn" onClick={() => setPlain("Meet me after sunset")}>Load sample</button><button className="btn" onClick={() => setPlain("")}>Clear</button></div>
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="Ciphertext" value={cipher} />
            <ValueRow label="Decrypt with inverse shift" value={decrypted} />
          </div>
        </Card>
      </div>
      <Card title="Alphabet mapping table">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-13">
          {mapping.map((item) => <div key={item.from} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-center font-mono text-sm">{item.from} → {item.to}</div>)}
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Brute force all shifts">
          <div className="max-h-96 overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm"><tbody>{brute.map((row) => <tr key={row.shift} className="border-b border-slate-100"><td className="w-20 p-2 font-mono">{row.shift}</td><td className="p-2">{row.text}</td></tr>)}</tbody></table>
          </div>
        </Card>
        <Card title="Frequency chart">
          <div className="space-y-2">{counts.map(({ letter, count }) => <div key={letter} className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-sm"><span className="font-mono">{letter}</span><div className="h-3 rounded bg-slate-100"><div className="h-3 rounded bg-cyan-500" style={{ width: `${Math.min(100, count * 12)}%` }} /></div><span className="font-mono">{count}</span></div>)}</div>
        </Card>
      </div>
      <WarningBadge>Caesar has only 26 keys, so exhaustive search is immediate. It is useful for learning substitution, not for secrecy.</WarningBadge>
    </div>
  );
}
