import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { MatrixView } from "../../../../components/common/MatrixView";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { asciiToHex } from "../../../../lib/format";
import { buildAes128Steps, changedIndexes, hexByte, hexWord } from "./aesEducationalCore";
import { aesSBox } from "./aesTables";

const samplePlaintext = "AES-128 input!!";
const sampleKey = "AES-128 key demo";

function matrixValues(bytes: number[]) {
  return bytes.map(hexByte);
}

function groupRoundKeys(roundKeys: number[][]) {
  return roundKeys.map((key, round) => ({ round, label: `K${round}`, words: [0, 1, 2, 3].map((index) => hexWord(key.slice(index * 4, index * 4 + 4))), bytes: key }));
}

export default function AES128StepPage() {
  const [plaintext, setPlaintext] = useState(samplePlaintext);
  const [key, setKey] = useState(sampleKey);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedByte, setSelectedByte] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const plaintextBytes = new TextEncoder().encode(plaintext).length;
  const keyBytes = new TextEncoder().encode(key).length;

  const aes = useMemo(() => buildAes128Steps(asciiToHex(plaintext, 16), asciiToHex(key, 16)), [key, plaintext]);
  const step = aes.steps[Math.min(stepIndex, aes.steps.length - 1)];
  const activeStepIndex = Math.min(stepIndex, aes.steps.length - 1);
  const roundKeys = useMemo(() => groupRoundKeys(aes.roundKeys), [aes.roundKeys]);
  const changed = changedIndexes(step.previousState, step.state);
  const sboxByte = step.byteMap?.[selectedByte] ?? step.byteMap?.[0];
  const visibleSBox = step.operation === "SubBytes" && sboxByte;

  useEffect(() => {
    setStepIndex((current) => Math.min(current, aes.steps.length - 1));
  }, [aes.steps.length]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= aes.steps.length - 1) return 0;
        return current + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [aes.steps.length, playing, speed]);

  const setAsciiPlaintext = (value: string) => setPlaintext(value);
  const setAsciiKey = (value: string) => setKey(value);

  return (
    <div className="space-y-6">
      <PageHeader title="AES-128 Internal Operations" category="Block Ciphers" status="Educational">
        Step through actual AES-128 internals: input state, key expansion, round keys, AddRoundKey, SubBytes using the real S-box, ShiftRows, MixColumns, and the final round.
      </PageHeader>

      <InputPanel title="AES-128 block, key, and playback controls">
        <div className="grid gap-4">
          <div className="grid gap-3 xl:grid-cols-2">
            <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Plaintext block ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${plaintextBytes === 16 ? "text-emerald-700" : "text-amber-700"}`}>{plaintextBytes}/16 bytes</span></span><input className="field mt-1 font-mono" value={plaintext} onChange={(event) => setAsciiPlaintext(event.target.value)} /></label>
            <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Cipher key ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${keyBytes === 16 ? "text-emerald-700" : "text-amber-700"}`}>{keyBytes}/16 bytes</span></span><input className="field mt-1 font-mono" value={key} onChange={(event) => setAsciiKey(event.target.value)} /></label>
          </div>
          <div className="grid gap-3 xl:grid-cols-[1fr_1fr_12rem]">
            <label className="label">Step selector<select className="field mt-1" value={activeStepIndex} onChange={(event) => setStepIndex(Number(event.target.value))}>{aes.steps.map((item, index) => <option key={item.id} value={index}>{index + 1}. {item.title}</option>)}</select></label>
            <label className="label">Round selector<select className="field mt-1" value={step.round} onChange={(event) => setStepIndex(aes.steps.findIndex((item) => item.round === Number(event.target.value)))}>{Array.from({ length: 11 }, (_, round) => <option key={round} value={round}>Round {round}</option>)}</select></label>
            <label className="label">Speed {speed} ms<input className="mt-3 w-full" type="range" min="150" max="1600" step="50" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn" onClick={() => setStepIndex(Math.max(0, activeStepIndex - 1))}>Previous Step</button>
            <button className="btn" onClick={() => setStepIndex(Math.min(aes.steps.length - 1, activeStepIndex + 1))}>Next Step</button>
            <button className="btn" onClick={() => setPlaying(true)}>Auto Play</button>
            <button className="btn" onClick={() => setPlaying(false)}>Pause</button>
            <button className="btn" onClick={() => { setPlaying(false); setStepIndex(0); }}>Reset</button>
            <button className="btn" onClick={() => { setPlaintext(samplePlaintext); setKey(sampleKey); setStepIndex(0); }}>Load AES sample</button>
            <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-sm">Step {activeStepIndex + 1} / {aes.steps.length}</span>
          </div>
        </div>
      </InputPanel>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{step.explanation}</p>
            </div>
            <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">{step.operation}</span>
          </div>
          <MatrixView values={matrixValues(step.state)} changed={changed} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase text-slate-500">State hex</div>
              <div className="mt-1 break-all font-mono text-sm">{hexWord(step.state)}</div>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-semibold uppercase text-slate-500">Changed bytes</div>
              <div className="mt-1 font-mono text-sm">{changed.length ? changed.map((index) => index.toString()).join(", ") : "none"}</div>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Before and after bytes</h2>
          <div className="max-h-[34rem] overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr><th className="p-2 text-left">Index</th><th className="p-2 text-left">Before</th><th className="p-2 text-left">After</th><th className="p-2 text-left">Meaning</th></tr>
              </thead>
              <tbody>{step.state.map((byte, index) => {
                const before = step.previousState[index];
                return <tr key={index} className={before !== byte ? "border-t border-cyan-100 bg-cyan-50" : "border-t border-slate-100"}><td className="p-2 font-mono">{index}</td><td className="p-2 font-mono">{hexByte(before)}</td><td className="p-2 font-mono">{hexByte(byte)}</td><td className="p-2 text-slate-600">{step.operation === "SubBytes" ? "S-box substitution" : step.operation === "AddRoundKey" ? "XOR with key byte" : step.operation}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Round key at this step</h2>
          {step.roundKey ? (
            <div className="space-y-4">
              <MatrixView values={matrixValues(step.roundKey)} changed={changed} />
              <div className="grid gap-2 md:grid-cols-4">{[0, 1, 2, 3].map((word) => <div key={word} className="rounded-md bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">w{step.round * 4 + word}</div><div className="font-mono text-sm">{hexWord(step.roundKey!.slice(word * 4, word * 4 + 4))}</div></div>)}</div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">This operation does not consume a round key. AddRoundKey steps show the key bytes used in the XOR.</p>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Key expansion timeline</h2>
          <div className="max-h-80 space-y-2 overflow-auto">
            {roundKeys.map((roundKey) => <button key={roundKey.round} className={`w-full rounded-md border p-3 text-left ${roundKey.round === step.round ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-slate-50"}`} onClick={() => setStepIndex(aes.steps.findIndex((item) => item.round === roundKey.round))}>
              <div className="flex items-center justify-between"><span className="font-semibold">{roundKey.label}</span><span className="font-mono text-xs">round {roundKey.round}</span></div>
              <div className="mt-2 grid gap-1 md:grid-cols-4">{roundKey.words.map((word, index) => <span key={index} className="font-mono text-xs">{word}</span>)}</div>
            </button>)}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">S-box step-by-step</h2>
          {visibleSBox ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                <label className="label md:col-span-2">Byte inside SubBytes<select className="field mt-1" value={selectedByte} onChange={(event) => setSelectedByte(Number(event.target.value))}>{step.byteMap!.map((item) => <option key={item.index} value={item.index}>byte {item.index}: {hexByte(item.before)} to {hexByte(item.after)}</option>)}</select></label>
                <div className="rounded-md bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Row</div><div className="font-mono text-2xl">{sboxByte.row.toString(16)}</div></div>
                <div className="rounded-md bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">Column</div><div className="font-mono text-2xl">{sboxByte.col.toString(16)}</div></div>
              </div>
              <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4">
                <div className="font-mono text-lg">{hexByte(sboxByte.before)} {"->"} SBox[{sboxByte.row.toString(16)}][{sboxByte.col.toString(16)}] {"->"} {hexByte(sboxByte.after)}</div>
                <p className="mt-2 text-sm text-cyan-900">High nibble chooses the row. Low nibble chooses the column. The selected table value replaces the byte.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Move to any SubBytes step to inspect each byte's S-box row, column, and substituted output.</p>
          )}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Real AES S-box grid</h2>
          <div className="grid grid-cols-16 gap-1">
            {aesSBox.map((value, index) => {
              const isActive = visibleSBox && index === sboxByte.before;
              const sameRowOrColumn = visibleSBox && (Math.floor(index / 16) === sboxByte.row || index % 16 === sboxByte.col);
              return <div key={index} className={`rounded px-1 py-2 text-center font-mono text-[11px] ${isActive ? "bg-cyan-600 text-white" : sameRowOrColumn ? "bg-cyan-50 text-cyan-900" : "bg-slate-100"}`}>{hexByte(value)}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">All internal operations</h2>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {aes.steps.map((item, index) => <button key={item.id} onClick={() => setStepIndex(index)} className={`rounded-md border p-3 text-left text-sm ${index === activeStepIndex ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}>
            <div className="font-mono text-xs text-slate-500">Step {index + 1}</div>
            <div className="font-semibold">{item.title}</div>
            <div className="mt-1 text-xs text-slate-600">Round {item.round} - {item.operation}</div>
          </button>)}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Final ciphertext</h2>
          <p className="mt-2 break-all font-mono text-sm">{hexWord(aes.ciphertext)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Mistakes and warnings</h2>
          <WarningBadge>This page intentionally exposes internal state and round keys for learning. Production AES implementations must not leak this data through logs, timing, or UI.</WarningBadge>
        </div>
      </section>
    </div>
  );
}
