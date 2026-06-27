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
  const [activeIndex, setActiveIndex] = useState(0);
  const cipher = useMemo(() => atbash(text), [text]);
  const roundTrip = useMemo(() => atbash(cipher), [cipher]);
  const safeActiveIndex = Math.min(activeIndex, Math.max(text.length - 1, 0));
  const activeChar = text[safeActiveIndex] ?? "";
  const activeOut = /[a-z]/i.test(activeChar) ? atbash(activeChar) : activeChar;
  const steppedOutput = Array.from(text).map((char, index) => index <= safeActiveIndex ? atbash(char) : char).join("");

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
          <Field label={`Letter change: character ${safeActiveIndex + 1} of ${Math.max(text.length, 1)}`}>
            <input type="range" min="0" max={Math.max(text.length - 1, 0)} value={safeActiveIndex} onChange={(event) => setActiveIndex(Number(event.target.value))} className="w-full" />
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
      <Card title="Normal and reversed alphabets">
        <div className="space-y-2 font-mono text-sm">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-500">
            <span>Normal alphabet stays visible</span>
            <span>Selected letter mirrors downward</span>
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(26, minmax(1.5rem, 1fr))" }}>{ALPHA.split("").map((letter) => <span key={letter} className={`rounded border px-1 py-2 text-center ${letter === activeChar.toUpperCase() ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>{letter}</span>)}</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(26, minmax(1.5rem, 1fr))" }}>{ALPHA.split("").map((letter, index) => <span key={`line-${letter}`} className={`h-4 border-x text-center ${letter === activeChar.toUpperCase() || ALPHA[25 - index] === activeOut.toUpperCase() ? "border-amber-400" : "border-slate-200"}`} />)}</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(26, minmax(1.5rem, 1fr))" }}>{ALPHA.split("").reverse().map((letter) => <span key={letter} className={`rounded border px-1 py-2 text-center ${letter === activeOut.toUpperCase() ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>{letter}</span>)}</div>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-500">
            <span>Reversed alphabet stays visible</span>
            <span>{/[a-z]/i.test(activeChar) ? `${activeChar.toUpperCase()} becomes ${activeOut.toUpperCase()}` : "Non-letters pass through"}</span>
          </div>
        </div>
      </Card>
      <Card title="One letter at a time">
        <div className="grid gap-4 md:grid-cols-[8rem_1fr]">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-center">
            <div className="text-xs font-semibold uppercase text-amber-800">Current mirror</div>
            <div className="mt-2 font-mono text-2xl">{activeChar || " "} {"->"} {activeOut || " "}</div>
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Atbash output builds progressively</div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-sm">{steppedOutput}</div>
          </div>
        </div>
      </Card>
      <Card title="Reflection mapping (A-Z <-> Z-A)">
        <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 lg:grid-cols-13">
          {mapping.map(({ from, to }) => (
            <div key={from} className={`rounded-md border p-2 text-center font-mono text-sm ${from === activeChar.toUpperCase() ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
              {from} {"<->"} {to}
            </div>
          ))}
        </div>
      </Card>
      <WarningBadge>Atbash has no key: the mapping is fixed and public. Anyone who sees the ciphertext can decode it immediately. It demonstrates monoalphabetic substitution, not secrecy.</WarningBadge>
    </div>
  );
}
