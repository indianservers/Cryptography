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
  const [activeIndex, setActiveIndex] = useState(0);
  const cipher = useMemo(() => caesar(plain, shift), [plain, shift]);
  const decrypted = useMemo(() => caesar(cipher, -shift), [cipher, shift]);
  const brute = useMemo(() => Array.from({ length: 26 }, (_, value) => ({ shift: value, text: caesar(cipher, -value) })), [cipher]);
  const counts = useMemo(() => frequency(cipher), [cipher]);
  const mapping = alphabet.split("").map((letter, index) => ({ from: letter, to: alphabet[(index + shift) % 26] }));
  const safeActiveIndex = Math.min(activeIndex, Math.max(plain.length - 1, 0));
  const activeChar = plain[safeActiveIndex] ?? "";
  const activeShift = /[a-z]/i.test(activeChar) ? caesar(activeChar, shift) : activeChar;
  const activeLetter = activeChar.toUpperCase();
  const activeLetterIndex = alphabet.indexOf(activeLetter);
  const shiftedLetterIndex = activeLetterIndex >= 0 ? (activeLetterIndex + shift) % 26 : -1;
  const correctCandidate = brute.find((row) => row.shift === shift);
  const animatedCipher = Array.from(plain).map((char, index) => index <= safeActiveIndex ? caesar(char, shift) : char).join("");
  const activeLetterStyle = shiftedLetterIndex >= 0 ? { left: `${(shiftedLetterIndex / 25) * 100}%` } : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Caesar Cipher" category="Classical Cryptography" status="Educational">
        A fixed alphabet rotation. This page performs real Caesar encryption/decryption, shows moving letters, and brute forces every possible shift.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Plaintext and shift">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label={`Shift: ${shift}`}><input type="range" min="0" max="25" value={shift} onChange={(event) => setShift(Number(event.target.value))} className="w-full" /></Field>
            <Field label={`Letter movement: character ${safeActiveIndex + 1} of ${Math.max(plain.length, 1)}`}>
              <input type="range" min="0" max={Math.max(plain.length - 1, 0)} value={safeActiveIndex} onChange={(event) => setActiveIndex(Number(event.target.value))} className="w-full" />
            </Field>
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
          {mapping.map((item) => <div key={item.from} className={`rounded-md border p-2 text-center font-mono text-sm ${item.from === activeChar.toUpperCase() ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>{item.from} {"->"} {item.to}</div>)}
        </div>
      </Card>
      <Card title="Animated shift preview">
        <div className="grid gap-4 md:grid-cols-[10rem_1fr]">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-center">
            <div className="text-xs font-semibold uppercase text-amber-800">Current move</div>
            <div className="mt-2 font-mono text-2xl">{activeChar || " "} {"->"} {activeShift || " "}</div>
            <div className="mt-2 text-xs font-medium text-amber-900">Shift by {shift} place{shift === 1 ? "" : "s"}</div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Letter moves across the alphabet</div>
              <div className="rounded-md border border-slate-200 bg-white p-3">
                <div className="relative h-20">
                  <div className="absolute left-0 right-0 top-8 grid gap-0 rounded-md border border-slate-200 bg-slate-50 px-1 py-2 font-mono text-[10px] text-slate-500 sm:text-xs" style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}>
                    {alphabet.split("").map((letter, index) => (
                      <span key={letter} className={`text-center ${index === activeLetterIndex ? "font-bold text-amber-700" : ""} ${index === shiftedLetterIndex ? "font-bold text-teal-700" : ""}`}>{letter}</span>
                    ))}
                  </div>
                  {shiftedLetterIndex >= 0 ? (
                    <>
                      <div className="absolute top-0 -translate-x-1/2 rounded-md border border-amber-300 bg-amber-100 px-2 py-1 font-mono text-sm font-bold text-amber-950 shadow-sm" style={{ left: `${(activeLetterIndex / 25) * 100}%` }}>
                        {activeLetter}
                      </div>
                      <div className="changed-byte absolute top-14 -translate-x-1/2 rounded-md border border-teal-400 bg-teal-100 px-2 py-1 font-mono text-sm font-bold text-teal-950 shadow-sm transition-[left] duration-700 ease-out" style={activeLetterStyle}>
                        {activeShift.toUpperCase()}
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-x-0 top-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">Spaces and punctuation do not move; they pass through unchanged.</div>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>original position</span>
                  <span>shifted position</span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase text-slate-500">Cipher appears one character at a time</div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-sm">{animatedCipher}</div>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Brute force all shifts">
          {correctCandidate && (
            <div className="mb-4 rounded-md border-2 border-emerald-400 bg-emerald-50 p-4 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-800">Correct answer after brute force</div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-emerald-300 bg-white px-3 py-2 font-mono text-sm font-bold text-emerald-950">shift {correctCandidate.shift}</span>
                <span className="font-mono text-sm text-emerald-950">{correctCandidate.text}</span>
              </div>
            </div>
          )}
          <div className="max-h-96 overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm"><tbody>{brute.map((row) => {
              const isCorrect = row.shift === shift;
              return (
                <tr key={row.shift} className={`border-b border-slate-100 ${isCorrect ? "bg-emerald-100 ring-2 ring-inset ring-emerald-400" : ""}`}>
                  <td className={`w-20 p-2 font-mono ${isCorrect ? "font-bold text-emerald-950" : ""}`}>{row.shift}</td>
                  <td className={`p-2 ${isCorrect ? "font-semibold text-emerald-950" : ""}`}>
                    {row.text}
                    {isCorrect && <span className="ml-2 rounded-full border border-emerald-300 bg-white px-2 py-0.5 text-xs font-bold uppercase text-emerald-800">Correct answer</span>}
                  </td>
                </tr>
              );
            })}</tbody></table>
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
