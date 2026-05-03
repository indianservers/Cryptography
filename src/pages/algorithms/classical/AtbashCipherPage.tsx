import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const atbash = (text: string) =>
  text.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const index = ALPHA.indexOf(char.toUpperCase());
    const mapped = ALPHA[25 - index];
    return lower ? mapped.toLowerCase() : mapped;
  });

export default function AtbashCipherPage() {
  const [text, setText] = useState("Hello World");
  const cipher = useMemo(() => atbash(text), [text]);
  const roundTrip = useMemo(() => atbash(cipher), [cipher]);

  const mapping = ALPHA.split("").map((letter, index) => ({
    from: letter,
    to: ALPHA[25 - index],
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Atbash Cipher" category="Classical Cryptography" status="Unsafe">
        Mirrors the alphabet so A maps to Z, B maps to Y, C maps to X, and so on. Because every letter maps to exactly one other, applying it twice returns the original text.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input">
          <Field label="Plaintext">
            <textarea
              className="field min-h-28"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Field>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setText("Hello World")}>Sample</button>
            <button className="btn" onClick={() => setText("")}>Clear</button>
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="Atbash ciphertext" value={cipher} />
            <ValueRow label="Re-apply Atbash (round-trip)" value={roundTrip} />
          </div>
        </Card>
      </div>
      <Card title="Reflection mapping (A-Z <-> Z-A)">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 lg:grid-cols-13">
          {mapping.map(({ from, to }) => (
            <div key={from} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-center font-mono text-sm">
              {from} {"<->"} {to}
            </div>
          ))}
        </div>
      </Card>
      <WarningBadge>Atbash has no key: the mapping is fixed and public. Anyone who sees the ciphertext can decode it immediately. It demonstrates monoalphabetic substitution, not secrecy.</WarningBadge>
    </div>
  );
}
