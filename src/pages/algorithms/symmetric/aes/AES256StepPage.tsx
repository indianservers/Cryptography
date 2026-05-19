import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { MatrixView } from "../../../../components/common/MatrixView";
import { StepControls } from "../../../../components/common/StepControls";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { asciiToHex } from "../../../../lib/format";
import { buildAesSteps, changedIndexes, hexByte, hexWord } from "./aesEducationalCore";

export default function AES256StepPage() {
  const [plain, setPlain] = useState("AES-256 input!!");
  const [key, setKey] = useState("AES-256 key material for demo!!!");
  const [stepIndex, setStepIndex] = useState(0);
  const plainBytes = new TextEncoder().encode(plain).length;
  const keyBytesLength = new TextEncoder().encode(key).length;
  const aes = useMemo(() => buildAesSteps(asciiToHex(plain, 16), asciiToHex(key, 32), 256), [plain, key]);
  const step = aes.steps[Math.min(stepIndex, aes.steps.length - 1)];
  const changed = changedIndexes(step.previousState, step.state);
  const keyWords = useMemo(() => aes.roundKeys.flatMap((roundKey, round) => Array.from({ length: 4 }, (_, word) => ({ round, word, value: roundKey.slice(word * 4, word * 4 + 4) }))), [aes.roundKeys]);

  return (
    <div className="space-y-6">
      <PageHeader title="AES-256 Step Visualizer" category="Block Ciphers" status="Educational">Trace real AES-256 over one block. AES-256 uses Nk=8, an extra SubWord branch in key expansion, 14 rounds, and 15 round keys.</PageHeader>
      <InputPanel title="AES-256 inputs">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Plaintext block ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${plainBytes === 16 ? "text-emerald-700" : "text-amber-700"}`}>{plainBytes}/16 bytes</span></span><input className="field mt-1 font-mono" value={plain} onChange={(event) => { setPlain(event.target.value); setStepIndex(0); }} /></label>
          <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">256-bit key ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${keyBytesLength === 32 ? "text-emerald-700" : "text-amber-700"}`}>{keyBytesLength}/32 bytes</span></span><input className={`field mt-1 font-mono ${keyBytesLength === 32 ? "bg-emerald-50" : "bg-rose-50"}`} value={key} onChange={(event) => { setKey(event.target.value); setStepIndex(0); }} /></label>
        </div>
      </InputPanel>
      <StepControls step={Math.min(stepIndex, aes.steps.length - 1)} max={aes.steps.length - 1} onStep={setStepIndex} />
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">{step.title}</h2>
          <p className="text-sm text-slate-600">{step.explanation}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2"><MatrixView values={step.previousState.map(hexByte)} /><MatrixView values={step.state.map(hexByte)} changed={changed} /></div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Expanded AES-256 words</h2>
          <div className="max-h-96 overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Round</th><th className="p-2 text-left">Word</th><th className="p-2 text-left">Value</th></tr></thead><tbody>{keyWords.map((item, index) => <tr key={`${item.round}-${item.word}`} className={item.round === step.round ? "border-t border-slate-100 bg-cyan-50" : "border-t border-slate-100"}><td className="p-2 font-mono">K{item.round}</td><td className="p-2 font-mono">w{index}</td><td className="p-2 font-mono text-xs">{hexWord(item.value)}</td></tr>)}</tbody></table>
          </div>
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Final ciphertext</h2><p className="mt-2 break-all font-mono text-sm">{hexWord(aes.ciphertext)}</p><div className="mt-4"><WarningBadge>AES-256 has more rounds than AES-128, but mode choice and nonce handling still decide whether a full message encryption is safe.</WarningBadge></div></section>
    </div>
  );
}
