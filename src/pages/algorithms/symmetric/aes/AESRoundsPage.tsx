import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { MatrixView } from "../../../../components/common/MatrixView";
import { StepControls } from "../../../../components/common/StepControls";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { asciiToHex } from "../../../../lib/format";
import { buildAesSteps, changedIndexes, hexByte, hexWord } from "./aesEducationalCore";

type AesBits = 128 | 192 | 256;

export default function AESRoundsPage() {
  const [bits, setBits] = useState<AesBits>(128);
  const [plain, setPlain] = useState("AES round input!");
  const [key, setKey] = useState("AES round key 12");
  const [stepIndex, setStepIndex] = useState(0);
  const keyBytes = bits / 8;
  const plainBytes = new TextEncoder().encode(plain).length;
  const keyByteLength = new TextEncoder().encode(key).length;
  const trace = useMemo(() => buildAesSteps(asciiToHex(plain, 16), asciiToHex(key, keyBytes), bits), [bits, key, keyBytes, plain]);
  const step = trace.steps[Math.min(stepIndex, trace.steps.length - 1)];
  const changed = changedIndexes(step.previousState, step.state);

  const setPreset = (next: AesBits) => {
    setBits(next);
    setKey(next === 128 ? "AES round key 12" : next === 192 ? "AES round key 192 demo!" : "AES round key 256 demo material");
    setStepIndex(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AES Rounds" category="Block Ciphers" status="Educational">A focused AES internal-operations page. Pick AES-128, AES-192, or AES-256 and step through every SubBytes, ShiftRows, MixColumns, and AddRoundKey state.</PageHeader>
      <InputPanel title="Round trace inputs">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="label">AES size<select className="field mt-1" value={bits} onChange={(event) => setPreset(Number(event.target.value) as AesBits)}><option value={128}>AES-128</option><option value={192}>AES-192</option><option value={256}>AES-256</option></select></label>
          <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Plaintext block ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${plainBytes === 16 ? "text-emerald-700" : "text-amber-700"}`}>{plainBytes}/16 bytes</span></span><input className="field mt-1 font-mono" value={plain} onChange={(event) => { setPlain(event.target.value); setStepIndex(0); }} /></label>
          <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Key ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${keyByteLength === keyBytes ? "text-emerald-700" : "text-amber-700"}`}>{keyByteLength}/{keyBytes} bytes</span></span><input className="field mt-1 font-mono" value={key} onChange={(event) => { setKey(event.target.value); setStepIndex(0); }} /></label>
        </div>
      </InputPanel>
      <div className="sticky top-0 z-10"><StepControls step={Math.min(stepIndex, trace.steps.length - 1)} max={trace.steps.length - 1} onStep={setStepIndex} /></div>
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">{step.title}</h2>
          <p className="text-sm text-slate-600">{step.explanation}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2"><div><h3 className="mb-2 font-semibold">Before</h3><MatrixView values={step.previousState.map(hexByte)} /></div><div><h3 className="mb-2 font-semibold">After</h3><MatrixView values={step.state.map(hexByte)} changed={changed} /></div></div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Round key K{step.round}</h2>
          <MatrixView values={(trace.roundKeys[step.round] ?? trace.roundKeys[0]).map(hexByte)} />
          <h3 className="mb-2 mt-5 font-semibold">Round minimap</h3>
          <div className="grid grid-cols-8 gap-2 md:grid-cols-12">{Array.from({ length: trace.rounds + 1 }, (_, round) => <button key={round} className={`rounded border px-2 py-1 font-mono text-xs ${round === step.round ? "border-cyan-400 bg-cyan-100" : "border-slate-200 bg-slate-50"}`} onClick={() => setStepIndex(Math.max(0, trace.steps.findIndex((item) => item.round === round)))}>R{round}</button>)}</div>
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Final ciphertext</h2><p className="mt-2 break-all font-mono text-sm">{hexWord(trace.ciphertext)}</p><div className="mt-4"><WarningBadge>This page intentionally exposes round keys and state values for learning. Production systems must never log this material.</WarningBadge></div></section>
    </div>
  );
}
