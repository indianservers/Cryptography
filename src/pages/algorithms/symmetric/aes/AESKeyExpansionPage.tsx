import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { Field } from "../../../../components/common/Field";
import { StepControls } from "../../../../components/common/StepControls";
import { MatrixView } from "../../../../components/common/MatrixView";
import { CopyButton } from "../../../../components/common/CopyButton";
import { textToHex } from "../../../../lib/format";
import { aesSBox } from "./aesTables";
import { bytesFromHex, cleanHex, expandAesKey, hexByte, hexWord } from "./aesEducationalCore";

type KeySize = 128 | 192 | 256;

const rcon = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];
const rotWord = (word: number[]) => [word[1], word[2], word[3], word[0]];
const subWord = (word: number[]) => word.map((byte) => aesSBox[byte]);
const xorWords = (a: number[], b: number[]) => a.map((byte, index) => byte ^ b[index]);
const keySamples: Record<KeySize, string> = {
  128: "Thats my Kung Fu",
  192: "AES-192 key material!!!!",
  256: "AES-256 key material for demo!!!",
};

function buildWordTrace(keyBytes: number[], size: KeySize) {
  const nk = size / 32;
  const nr = nk + 6;
  const totalWords = 4 * (nr + 1);
  const words: number[][] = [];
  const trace: { index: number; round: number; word: number[]; source: string; formula: string; before?: number[]; afterRot?: number[]; afterSub?: number[]; rcon?: number; previousNk?: number[] }[] = [];

  for (let index = 0; index < nk; index += 1) {
    const word = keyBytes.slice(index * 4, index * 4 + 4);
    words.push(word);
    trace.push({ index, round: Math.floor(index / 4), word, source: "Original key", formula: `w${index} comes directly from the cipher key.` });
  }

  for (let index = nk; index < totalWords; index += 1) {
    const previous = [...words[index - 1]];
    let temp = [...previous];
    let source = "XOR previous words";
    let formula = `w${index} = w${index - nk} xor w${index - 1}`;
    let afterRot: number[] | undefined;
    let afterSub: number[] | undefined;
    let rconByte: number | undefined;

    if (index % nk === 0) {
      afterRot = rotWord(temp);
      afterSub = subWord(afterRot);
      rconByte = rcon[index / nk];
      temp = [...afterSub];
      temp[0] ^= rconByte;
      source = "RotWord + SubWord + Rcon + XOR";
      formula = `w${index} = w${index - nk} xor SubWord(RotWord(w${index - 1})) xor Rcon[${index / nk}]`;
    } else if (nk > 6 && index % nk === 4) {
      afterSub = subWord(temp);
      temp = afterSub;
      source = "AES-256 SubWord branch + XOR";
      formula = `w${index} = w${index - nk} xor SubWord(w${index - 1})`;
    }

    const word = xorWords(words[index - nk], temp);
    words.push(word);
    trace.push({ index, round: Math.floor(index / 4), word, source, formula, before: previous, afterRot, afterSub, rcon: rconByte, previousNk: words[index - nk] });
  }

  return trace;
}

export default function AESKeyExpansionPage() {
  const [size, setSize] = useState<KeySize>(128);
  const [keyText, setKeyText] = useState(keySamples[128]);
  const [step, setStep] = useState(4);
  const keyBytes = size / 8;
  const keyHex = cleanHex(textToHex(keyText), keyBytes);
  const key = useMemo(() => bytesFromHex(keyHex, keyBytes), [keyBytes, keyHex]);
  const roundKeys = useMemo(() => expandAesKey(key, size), [key, size]);
  const trace = useMemo(() => buildWordTrace(key, size), [key, size]);
  const active = trace[Math.min(step, trace.length - 1)];
  const roundKeyText = roundKeys.map((roundKey, round) => `K${round}: ${hexWord(roundKey)}`).join("\n");

  return (
    <div className="space-y-6">
      <PageHeader title="AES Key Expansion" category="Block Ciphers" status="Educational">
        Build the real AES key schedule from the cipher key. Each new word is derived with RotWord, SubWord, Rcon, and XOR according to the AES key size.
      </PageHeader>

      <InputPanel title="AES key and key-size controls">
        <div className="grid gap-4 lg:grid-cols-[1fr_16rem]">
          <Field label="AES key text" value={keyText} expectedBytes={keyBytes} hint={`Converted to exactly ${keyBytes} AES key bytes for this visualization.`}>
            <input className="field font-mono" value={keyText} onChange={(event) => { setKeyText(event.target.value); setStep(0); }} />
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className={`rounded-full border px-2 py-0.5 font-semibold ${new TextEncoder().encode(keyText).length === keyBytes ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{new TextEncoder().encode(keyText).length}/{keyBytes} bytes</span>
              <span>Valid AES keys are exactly 16, 24, or 32 bytes for AES-128, AES-192, or AES-256.</span>
            </div>
          </Field>
          <label className="label">
            Key size
            <select className="field mt-1" value={size} onChange={(event) => { const next = Number(event.target.value) as KeySize; setSize(next); setKeyText(keySamples[next]); setStep(0); }}>
              <option value={128}>128-bit key</option>
              <option value={192}>192-bit key</option>
              <option value={256}>256-bit key</option>
            </select>
          </label>
        </div>
      </InputPanel>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Word-by-word expansion</h2>
            <p className="mt-1 text-sm text-slate-600">AES-{size} uses Nk={size / 32}, Nr={size / 32 + 6}, and {roundKeys.length} round keys.</p>
          </div>
          <CopyButton value={roundKeyText} label="Copy round keys" />
        </div>
        <StepControls step={Math.min(step, trace.length - 1)} max={trace.length - 1} onStep={setStep} />
        <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4">
            <div className="text-xs font-bold uppercase text-cyan-800">Current stage</div>
            <h3 className="mt-1 text-lg font-semibold text-cyan-950">w{active.index}: {active.source}</h3>
            <p className="mt-2 text-sm text-cyan-900">{active.formula}</p>
            <div className="mt-4 grid gap-3 text-sm">
              {active.previousNk && <div className="rounded-md bg-white p-3"><span className="font-semibold">w{active.index - size / 32}</span> xor input: <span className="font-mono">{hexWord(active.previousNk)}</span></div>}
              {active.before && <div className="rounded-md bg-white p-3"><span className="font-semibold">Previous word</span>: <span className="font-mono">{hexWord(active.before)}</span></div>}
              {active.afterRot && <div className="rounded-md bg-white p-3"><span className="font-semibold">After RotWord</span>: <span className="font-mono">{hexWord(active.afterRot)}</span></div>}
              {active.afterSub && <div className="rounded-md bg-white p-3"><span className="font-semibold">After SubWord</span>: <span className="font-mono">{hexWord(active.afterSub)}</span></div>}
              {active.rcon !== undefined && <div className="rounded-md bg-white p-3"><span className="font-semibold">Rcon</span>: <span className="font-mono">{hexByte(active.rcon)}000000</span></div>}
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3"><span className="font-semibold">New word</span>: <span className="font-mono">{hexWord(active.word)}</span></div>
            </div>
          </div>
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-2 text-left">Word</th>
                  <th className="p-2 text-left">Round</th>
                  <th className="p-2 text-left">Operation</th>
                  <th className="p-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {trace.map((item) => (
                  <tr key={item.index} className={`border-t border-slate-100 ${item.index === active.index ? "bg-cyan-50" : ""}`}>
                    <td className="p-2 font-mono">w{item.index}</td>
                    <td className="p-2 font-mono">K{item.round}</td>
                    <td className="p-2">{item.source}</td>
                    <td className="break-all p-2 font-mono text-xs">{hexWord(item.word)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Active round key matrix</h2>
          <MatrixView values={roundKeys[Math.min(active.round, roundKeys.length - 1)].map(hexByte)} active={(active.index % 4) * 4} changed={[0, 1, 2, 3].map((offset) => (active.index % 4) * 4 + offset)} />
          <p className="mt-3 text-sm text-slate-600">Round key K{Math.min(active.round, roundKeys.length - 1)} is four words joined into the 16-byte key used by AddRoundKey.</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Round keys</h2>
          <div className="max-h-96 space-y-2 overflow-auto">
            {roundKeys.map((roundKey, round) => (
              <div key={round} className={`rounded-md border p-3 ${round === active.round ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="text-xs font-bold uppercase text-slate-500">K{round}</div>
                <div className="mt-1 break-all font-mono text-xs text-slate-900">{hexWord(roundKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
