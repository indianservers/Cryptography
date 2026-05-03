import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { MatrixView } from "../../../../components/common/MatrixView";
import { StepControls } from "../../../../components/common/StepControls";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { buildAesSteps, changedIndexes, cleanHex, hexByte, hexWord } from "./aesEducationalCore";

export default function AES192StepPage() {
  const [plain, setPlain] = useState("00112233445566778899aabbccddeeff");
  const [key, setKey] = useState("000102030405060708090a0b0c0d0e0f1011121314151617");
  const [stepIndex, setStepIndex] = useState(0);
  const aes = useMemo(() => buildAesSteps(plain, key, 192), [plain, key]);
  const step = aes.steps[Math.min(stepIndex, aes.steps.length - 1)];
  const changed = changedIndexes(step.previousState, step.state);

  return (
    <div className="space-y-6">
      <PageHeader title="AES-192 Step Visualizer" category="Block Ciphers" status="Educational">Trace real AES-192 over one 16-byte block. AES-192 uses Nk=6 key words, 12 rounds, and 13 round keys.</PageHeader>
      <InputPanel title="AES-192 inputs">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="label">Plaintext block hex<input className="field mt-1 font-mono" value={plain} onChange={(event) => { setPlain(cleanHex(event.target.value, 16)); setStepIndex(0); }} /></label>
          <label className="label">192-bit key hex<input className={`field mt-1 font-mono ${cleanHex(key, 24).length === 48 ? "bg-emerald-50" : "bg-rose-50"}`} value={key} onChange={(event) => { setKey(event.target.value); setStepIndex(0); }} /></label>
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
          <h2 className="mb-3 text-lg font-semibold">AES-192 key schedule</h2>
          <div className="max-h-96 overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Round</th><th className="p-2 text-left">Round key</th></tr></thead><tbody>{aes.roundKeys.map((roundKey, round) => <tr key={round} className={round === step.round ? "border-t border-slate-100 bg-cyan-50" : "border-t border-slate-100"}><td className="p-2 font-mono">K{round}</td><td className="break-all p-2 font-mono text-xs">{hexWord(roundKey)}</td></tr>)}</tbody></table>
          </div>
        </div>
      </section>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Final ciphertext</h2><p className="mt-2 break-all font-mono text-sm">{hexWord(aes.ciphertext)}</p><div className="mt-4"><WarningBadge>AES-192 is real here, but this visualizer intentionally exposes internal round keys for learning only.</WarningBadge></div></section>
    </div>
  );
}
