import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Pause, Play, RotateCcw, Shuffle, SkipForward, Square, TimerReset } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { PresetBar, type PresetOption } from "../../../components/common/PresetBar";
import { CheckpointQuiz } from "../../../components/common/CheckpointQuiz";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import {
  DES_BRUTE_FORCE_MAX_BITS,
  DES_EFFECTIVE_KEY_BITS,
  DES_FULL_KEY_SPACE,
  asciiToDesBlockHex,
  candidatePosition,
  classifyDesKey,
  desKeyForCandidate,
  estimatedSeconds,
  expectedAttempts,
  formatDuration,
  hasOddDesParity,
  hammingDistanceHex,
  hexToBits,
  sanitizeDesBlockHex,
  type DesBruteForceRow,
  type DesKnownPair,
  type DesSearchSpeed,
  type DesSearchStatus,
  type DesWorkerCommand,
  type DesWorkerEvent,
} from "../../../lib/desBruteForce";
import { desCryptBlock } from "../symmetric/des/desEducationalCore";

const fixedEffectiveKey = 0x12695bc9b7b7a0n;
const fixedEffectiveKeyHex = fixedEffectiveKey.toString(16).padStart(14, "0");
const samplePlaintextHex = "0123456789abcdef";
const secondaryPlaintextHex = "fedcba9876543210";
const searchBitOptions = [4, 6, 8, 10, 12];
const hardwareRates = [
  { label: "Classroom browser illustration", rate: 1e6 },
  { label: "Parallel illustration", rate: 1e9 },
  { label: "Specialized illustration", rate: 1e12 },
];

const statusLabel: Record<DesSearchStatus, string> = {
  idle: "Ready to search",
  running: "Searching",
  paused: "Paused",
  found: "Matching key recovered",
  cancelled: "Search cancelled",
  exhausted: "Space exhausted",
};

const checkpointQuestions = [
  {
    question: "Why does a DES key contain 64 stored bits but only 56 effective key bits?",
    options: ["Eight bits are parity bits", "Eight bits store the plaintext", "DES uses an eight-bit nonce"],
    correctIndex: 0,
    explanation: "DES stores one parity bit in each of its eight key bytes; PC-1 discards those bits.",
  },
  {
    question: "How many attempts are expected on average in a uniformly ordered key space?",
    options: ["About half the space", "Exactly one attempt", "Twice the space"],
    correctIndex: 0,
    explanation: "A uniformly placed key is expected near the middle, although best and worst cases remain possible.",
  },
  {
    question: "What should replace DES in a new authenticated-encryption design?",
    options: ["AES-GCM", "Double DES", "DES-ECB"],
    correctIndex: 0,
    explanation: "AES-GCM provides modern key sizes and authentication when its nonce requirements are followed.",
  },
];

function metricTone(status: DesSearchStatus) {
  if (status === "found") return "success" as const;
  if (status === "paused" || status === "cancelled") return "warning" as const;
  return "info" as const;
}

function downloadText(filename: string, value: string) {
  const url = URL.createObjectURL(new Blob([value], { type: "text/markdown" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function BitStrip({ bits, variableBits }: { bits: string; variableBits: number }) {
  return (
    <div className="flex max-w-full flex-wrap gap-1" aria-label={`${bits.length}-bit effective key`}>
      {bits.split("").map((bit, index) => {
        const variable = index >= bits.length - variableBits;
        return (
          <span
            key={index}
            className={`inline-flex h-7 w-6 items-center justify-center rounded border font-mono text-xs font-bold ${
              variable ? "border-violet-300 bg-violet-100 text-violet-900" : "border-slate-200 bg-slate-50 text-slate-500"
            }`}
            title={variable ? `Variable effective bit ${index + 1}` : `Fixed effective bit ${index + 1}`}
          >
            {bit}
          </span>
        );
      })}
    </div>
  );
}

function CipherBitComparison({ target, produced }: { target: string; produced: string }) {
  const targetBits = hexToBits(target, 64);
  const producedBits = hexToBits(produced, 64);
  return (
    <div className="grid grid-cols-8 gap-1 sm:grid-cols-16" aria-label="Ciphertext bit comparison">
      {targetBits.split("").map((bit, index) => {
        const matches = bit === producedBits[index];
        return (
          <span
            key={index}
            className={`rounded border px-1 py-1 text-center font-mono text-[10px] ${
              matches ? "border-slate-200 bg-slate-50 text-slate-600" : "border-amber-300 bg-amber-100 text-amber-950"
            }`}
            title={`Bit ${index + 1}: target ${bit}, produced ${producedBits[index]}`}
          >
            {producedBits[index]}
          </span>
        );
      })}
    </div>
  );
}

export default function DESBruteForcePage() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const workerRef = useRef<Worker | null>(null);
  const primaryActionRef = useRef<HTMLButtonElement | null>(null);
  const [inputMode, setInputMode] = useState<"hex" | "ascii">("hex");
  const [plaintextHex, setPlaintextHex] = useState(samplePlaintextHex);
  const [plaintextAscii, setPlaintextAscii] = useState("DES demo");
  const [variableBits, setVariableBits] = useState(8);
  const [targetCandidate, setTargetCandidate] = useState(173);
  const [multiplePairs, setMultiplePairs] = useState(false);
  const [speed, setSpeed] = useState<DesSearchSpeed>("normal");
  const [status, setStatus] = useState<DesSearchStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [current, setCurrent] = useState<DesBruteForceRow | null>(null);
  const [sampleRows, setSampleRows] = useState<DesBruteForceRow[]>([]);
  const [match, setMatch] = useState<DesBruteForceRow | null>(null);
  const [prediction, setPrediction] = useState("");
  const [seed, setSeed] = useState("2026");
  const [showRounds, setShowRounds] = useState(false);
  const [announcement, setAnnouncement] = useState("DES brute-force lab ready.");

  const activePlaintextHex = inputMode === "ascii" ? asciiToDesBlockHex(plaintextAscii) : plaintextHex;
  const keySpaceSize = 2 ** variableBits;
  const boundedTarget = Math.min(targetCandidate, keySpaceSize - 1);
  const targetKey = useMemo(
    () => desKeyForCandidate(fixedEffectiveKey, boundedTarget, variableBits),
    [boundedTarget, variableBits],
  );
  const knownPairs = useMemo<DesKnownPair[]>(() => {
    const primary = {
      plaintextHex: activePlaintextHex,
      ciphertextHex: desCryptBlock(activePlaintextHex, targetKey.keyHex).outputHex,
    };
    if (!multiplePairs) return [primary];
    return [
      primary,
      {
        plaintextHex: secondaryPlaintextHex,
        ciphertextHex: desCryptBlock(secondaryPlaintextHex, targetKey.keyHex).outputHex,
      },
    ];
  }, [activePlaintextHex, multiplePairs, targetKey.keyHex]);

  const expectation = expectedAttempts(keySpaceSize);
  const progress = keySpaceSize ? Math.min(100, (attempts / keySpaceSize) * 100) : 0;
  const measuredRate = elapsedMs > 0 ? attempts / (elapsedMs / 1000) : 0;
  const remainingSeconds = measuredRate > 0 ? (keySpaceSize - attempts) / measuredRate : 0;
  const candidatePercent = candidatePosition(current?.candidate ?? 0, keySpaceSize);
  const currentKey = current ? desKeyForCandidate(fixedEffectiveKey, current.candidate, variableBits) : targetKey;
  const effectiveBits = currentKey.effectiveKey.toString(2).padStart(DES_EFFECTIVE_KEY_BITS, "0");
  const recoveredTrace = useMemo(
    () => match ? desCryptBlock(activePlaintextHex, match.keyHex) : null,
    [activePlaintextHex, match],
  );
  const adjacentCiphertext = useMemo(() => {
    const adjacent = (boundedTarget + 1) % keySpaceSize;
    const adjacentKey = desKeyForCandidate(fixedEffectiveKey, adjacent, variableBits);
    return desCryptBlock(activePlaintextHex, adjacentKey.keyHex).outputHex;
  }, [activePlaintextHex, boundedTarget, keySpaceSize, variableBits]);
  const avalancheDistance = hammingDistanceHex(knownPairs[0].ciphertextHex, adjacentCiphertext);

  const resetSearch = () => {
    if (status === "running" || status === "paused") {
      workerRef.current?.postMessage({ type: "cancel" } satisfies DesWorkerCommand);
    }
    setStatus("idle");
    setAttempts(0);
    setElapsedMs(0);
    setCurrent(null);
    setSampleRows([]);
    setMatch(null);
    setShowRounds(false);
    setAnnouncement("Search parameters changed. Ready to search.");
  };

  useEffect(() => {
    const worker = new Worker(new URL("../../../workers/desBruteForceWorker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<DesWorkerEvent>) => {
      const message = event.data;
      if (message.type === "progress") {
        setStatus(message.status);
        setAttempts(message.attempts);
        setElapsedMs(message.elapsedMs);
        setCurrent(message.current);
        setSampleRows(message.sampleRows);
        if (message.attempts > 0 && message.attempts % Math.max(1, Math.floor(message.keySpaceSize / 4)) === 0) {
          setAnnouncement(`${Math.round((message.attempts / message.keySpaceSize) * 100)} percent searched.`);
        }
        return;
      }
      if (message.type === "complete") {
        setStatus(message.status);
        setAttempts(message.attempts);
        setElapsedMs(message.elapsedMs);
        setMatch(message.match);
        setCurrent(message.match);
        setSampleRows(message.sampleRows);
        setAnnouncement(message.match
          ? `Matching candidate ${message.match.candidate} recovered after ${message.attempts} attempts.`
          : "The bounded key space was exhausted without a match.");
        window.setTimeout(() => primaryActionRef.current?.focus(), 0);
        return;
      }
      setStatus("cancelled");
      setAttempts(message.attempts);
      setElapsedMs(message.elapsedMs);
      setAnnouncement(`Search cancelled after ${message.attempts} attempts.`);
    };
    return () => worker.terminate();
  }, []);

  const startSearch = () => {
    setAttempts(0);
    setElapsedMs(0);
    setCurrent(null);
    setSampleRows([]);
    setMatch(null);
    setShowRounds(false);
    setStatus("running");
    setAnnouncement(`Searching ${keySpaceSize} bounded candidates.`);
    workerRef.current?.postMessage({
      type: "start",
      pairs: knownPairs,
      fixedEffectiveKeyHex,
      variableBits,
      speed: prefersReducedMotion && speed === "slow" ? "normal" : speed,
    } satisfies DesWorkerCommand);
  };

  const pauseSearch = () => workerRef.current?.postMessage({ type: "pause" } satisfies DesWorkerCommand);
  const resumeSearch = () => workerRef.current?.postMessage({ type: "resume" } satisfies DesWorkerCommand);
  const cancelSearch = () => workerRef.current?.postMessage({ type: "cancel" } satisfies DesWorkerCommand);
  const stepSearch = () => workerRef.current?.postMessage({ type: "step" } satisfies DesWorkerCommand);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.key.toLowerCase() === "s" && status !== "running") {
        event.preventDefault();
        startSearch();
      } else if (event.key.toLowerCase() === "p" && status === "running") {
        event.preventDefault();
        pauseSearch();
      } else if (event.key.toLowerCase() === "r" && status === "paused") {
        event.preventDefault();
        resumeSearch();
      } else if (event.key === "." && status === "paused") {
        event.preventDefault();
        stepSearch();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const applyScenario = (bits: number, candidate: number) => {
    resetSearch();
    setVariableBits(bits);
    setTargetCandidate(candidate);
  };

  const presets: PresetOption[] = [
    { label: "Best case", description: "4 bits; key is the first candidate.", difficulty: "Beginner", apply: () => applyScenario(4, 0) },
    { label: "Middle case", description: "8 bits; key lies near the expected average.", difficulty: "Intermediate", apply: () => applyScenario(8, 127) },
    { label: "Worst case", description: "10 bits; key is the final candidate.", difficulty: "Advanced", apply: () => applyScenario(10, 1023) },
    { label: "Slow walkthrough", description: "6 bits with one visible attempt per step.", difficulty: "Beginner", apply: () => { applyScenario(6, 37); setSpeed("slow"); } },
    { label: "Two-pair verification", description: "Use two known pairs to confirm every guess.", difficulty: "Intermediate", apply: () => { applyScenario(8, 173); setMultiplePairs(true); } },
  ];

  const randomizeCandidate = () => {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    resetSearch();
    setTargetCandidate(random[0] % keySpaceSize);
  };

  const applySeed = () => {
    const numericSeed = Number.parseInt(seed, 10) || 0;
    const deterministic = ((numericSeed * 1664525 + 1013904223) >>> 0) % keySpaceSize;
    resetSearch();
    setTargetCandidate(deterministic);
  };

  const report = [
    "# DES Brute-Force Classroom Report",
    "",
    `- Scope: bounded local demonstration (${variableBits} variable effective-key bits)`,
    `- Known plaintext: ${activePlaintextHex}`,
    `- Known pairs: ${knownPairs.length}`,
    `- Search status: ${statusLabel[status]}`,
    `- Attempts: ${attempts} of ${keySpaceSize}`,
    `- Elapsed browser time: ${elapsedMs.toFixed(1)} ms`,
    `- Recovered candidate: ${match?.candidate ?? "not recovered"}`,
    `- Recovered key: ${match ? `${match.keyHex.slice(0, 4)}…${match.keyHex.slice(-4)} (redacted)` : "not available"}`,
    "",
    "Educational boundary: this lab is capped at 12 variable bits and cannot search full DES or external targets.",
    "Defensive conclusion: migrate DES systems to an authenticated modern construction such as AES-GCM.",
  ].join("\n");

  const predictionNumber = Number.parseInt(prediction, 10);
  const predictionFeedback = match && Number.isFinite(predictionNumber)
    ? Math.abs(predictionNumber - attempts) === 0
      ? "Exact prediction."
      : `Your prediction differed by ${Math.abs(predictionNumber - attempts)} attempts.`
    : "";

  return (
    <div className="space-y-6">
      <PageHeader title="DES Brute-Force Key Search" category="Cryptanalysis and Attacks" status="Educational">
        Exhaust a reduced DES effective-key suffix, inspect each verification step, and connect measured classroom work to DES&apos;s real 56-bit weakness.
      </PageHeader>

      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>

      <WarningBadge>
        This local lab is hard-capped at {DES_BRUTE_FORCE_MAX_BITS} variable effective-key bits ({2 ** DES_BRUTE_FORCE_MAX_BITS} candidates).
        It generates its own targets, cannot search the full 56-bit DES space, and is designed for defensive classroom learning.
      </WarningBadge>

      <PresetBar presets={presets} />

      <Card title="How exhaustive key search works" eyebrow="Learning path">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["1", "Known pair", "Start with plaintext P and its DES ciphertext C."],
            ["2", "Candidate key", "Generate the next reduced candidate Kᵢ."],
            ["3", "Verify", "Compute DESₖᵢ(P) and compare it with C."],
            ["4", "Stop or continue", "Accept an exact match; otherwise increment Kᵢ."],
          ].map(([number, title, text]) => (
            <div key={number} className="rounded-md border border-teal-100 bg-teal-50 p-3">
              <div className="font-mono text-xs font-bold text-teal-700">STEP {number}</div>
              <div className="mt-1 font-semibold text-slate-900">{title}</div>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-cyan-100">
          For Kᵢ = 0 … 2ⁿ−1: accept Kᵢ only when DESₖᵢ(P) = C
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card title="Bounded classroom setup">
          <div className="grid gap-4">
            <Field label="Plaintext input mode">
              <select className="field" value={inputMode} onChange={(event) => { resetSearch(); setInputMode(event.target.value as "hex" | "ascii"); }}>
                <option value="hex">Hexadecimal block</option>
                <option value="ascii">ASCII text (up to 8 bytes)</option>
              </select>
            </Field>
            {inputMode === "hex" ? (
              <Field label="Known plaintext block (16 hex digits)">
                <input
                  className="field font-mono"
                  aria-label="Known plaintext block in hexadecimal"
                  value={plaintextHex}
                  onChange={(event) => { resetSearch(); setPlaintextHex(sanitizeDesBlockHex(event.target.value)); }}
                />
              </Field>
            ) : (
              <Field label="Known plaintext ASCII" hint={`Encoded block: ${activePlaintextHex}`}>
                <input
                  className="field font-mono"
                  aria-label="Known plaintext in ASCII"
                  maxLength={8}
                  value={plaintextAscii}
                  onChange={(event) => { resetSearch(); setPlaintextAscii(event.target.value); }}
                />
              </Field>
            )}
            <Field label="Variable effective-key bits" hint="Every added bit doubles the number of candidates.">
              <select
                className="field"
                value={variableBits}
                onChange={(event) => {
                  const bits = Number(event.target.value);
                  resetSearch();
                  setVariableBits(bits);
                  setTargetCandidate((value) => Math.min(value, 2 ** bits - 1));
                }}
              >
                {searchBitOptions.map((bits) => <option key={bits} value={bits}>{bits} bits — {2 ** bits} candidates</option>)}
              </select>
            </Field>
            <Field label={`Hidden candidate (0–${keySpaceSize - 1})`} hint="This value only generates the local classroom target.">
              <input
                className="field font-mono"
                type="number"
                min={0}
                max={keySpaceSize - 1}
                value={boundedTarget}
                onChange={(event) => {
                  resetSearch();
                  setTargetCandidate(Math.min(keySpaceSize - 1, Math.max(0, Number(event.target.value) || 0)));
                }}
              />
            </Field>
            <label className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold">
              <input type="checkbox" checked={multiplePairs} onChange={(event) => { resetSearch(); setMultiplePairs(event.target.checked); }} />
              Verify with two known plaintext–ciphertext pairs
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Educational speed">
                <select
                  className="field"
                  value={speed}
                  onChange={(event) => {
                    const nextSpeed = event.target.value as DesSearchSpeed;
                    setSpeed(nextSpeed);
                    workerRef.current?.postMessage({ type: "speed", speed: nextSpeed } satisfies DesWorkerCommand);
                  }}
                >
                  <option value="slow">Slow — one visible attempt</option>
                  <option value="normal">Normal — chunked progress</option>
                  <option value="maximum">Maximum — fastest bounded run</option>
                </select>
              </Field>
              <Field label="Predict attempt count" hint={`Best ${expectation.best}; average ${expectation.average}; worst ${expectation.worst}.`}>
                <input className="field font-mono" type="number" min={1} max={keySpaceSize} value={prediction} onChange={(event) => setPrediction(event.target.value)} />
              </Field>
            </div>
            {variableBits >= 12 && <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">The 12-bit setting can briefly use noticeable CPU. Progress remains cancellable because work runs outside the interface thread.</p>}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {status !== "running" && status !== "paused" && (
              <button ref={primaryActionRef} className="btn btn-primary" type="button" onClick={startSearch}><Play className="h-4 w-4" /> Start <span className="text-xs opacity-80">Alt+S</span></button>
            )}
            {status === "running" && <button className="btn btn-warning" type="button" onClick={pauseSearch}><Pause className="h-4 w-4" /> Pause <span className="text-xs opacity-80">Alt+P</span></button>}
            {status === "paused" && <button className="btn btn-primary" type="button" onClick={resumeSearch}><Play className="h-4 w-4" /> Resume <span className="text-xs opacity-80">Alt+R</span></button>}
            {status === "paused" && <button className="btn" type="button" onClick={stepSearch}><SkipForward className="h-4 w-4" /> One step <span className="text-xs opacity-80">Alt+.</span></button>}
            {(status === "running" || status === "paused") && <button className="btn" type="button" onClick={cancelSearch}><Square className="h-4 w-4" /> Cancel</button>}
            <button className="btn" type="button" onClick={randomizeCandidate}><Shuffle className="h-4 w-4" /> Random toy key</button>
            <button className="btn" type="button" onClick={() => {
              resetSearch();
              setInputMode("hex");
              setPlaintextHex(samplePlaintextHex);
              setVariableBits(8);
              setTargetCandidate(173);
              setMultiplePairs(false);
              setSpeed("normal");
              setPrediction("");
            }}><RotateCcw className="h-4 w-4" /> Reset sample</button>
          </div>

          <div className="mt-4 grid gap-2 sm:flex">
            <input className="field font-mono" aria-label="Deterministic sample seed" value={seed} onChange={(event) => setSeed(event.target.value)} />
            <button className="btn sm:shrink-0" type="button" onClick={applySeed}><TimerReset className="h-4 w-4" /> Apply seed</button>
          </div>
          <p className="mt-2 text-xs text-slate-500">Seeded samples are deterministic and reproducible for classroom demonstrations.</p>
        </Card>

        <Card title="Search progress and recovered result">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone={metricTone(status)}>{statusLabel[status]}</StatusPill>
            <StatusPill tone="info">{attempts.toLocaleString()} / {keySpaceSize.toLocaleString()} attempts</StatusPill>
            <StatusPill tone="info">{measuredRate ? `${Math.round(measuredRate).toLocaleString()} keys/s` : "Throughput pending"}</StatusPill>
            {prefersReducedMotion && <StatusPill tone="warning">Reduced motion</StatusPill>}
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600"><span>Search progress</span><span>{progress.toFixed(1)}%</span></div>
            <div className="h-4 overflow-hidden rounded-full border border-slate-200 bg-slate-100" role="progressbar" aria-valuemin={0} aria-valuemax={keySpaceSize} aria-valuenow={attempts} aria-label="DES candidate search progress">
              <div className="h-full bg-teal-600 transition-[width]" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
              <span>Elapsed: {formatDuration(elapsedMs / 1000)}</span>
              <span>Estimated remaining: {status === "running" && measuredRate ? formatDuration(remainingSeconds) : "—"}</span>
            </div>
          </div>

          <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600"><span>Search-space position</span><span>{current?.candidate ?? 0} of {keySpaceSize - 1}</span></div>
            <div className="relative h-8 rounded bg-gradient-to-r from-sky-100 via-violet-100 to-rose-100">
              <span className="absolute inset-y-0 w-1 rounded bg-slate-900" style={{ left: `calc(${candidatePercent}% - 2px)` }} aria-hidden="true" />
              <span className="absolute inset-y-1 w-1 rounded bg-emerald-600" style={{ left: `calc(${candidatePosition(boundedTarget, keySpaceSize)}% - 2px)` }} aria-hidden="true" />
            </div>
            <div className="mt-1 flex justify-between text-[11px] font-semibold text-slate-500"><span>0</span><span>Current: black · hidden target: green</span><span>{keySpaceSize - 1}</span></div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ValueRow label="Previous candidate" value={current && current.candidate > 0 ? String(current.candidate - 1) : "—"} copy={false} />
            <ValueRow label="Current candidate" value={current?.candidate.toString() ?? "—"} copy={false} />
            <ValueRow label="Next candidate" value={current && current.candidate + 1 < keySpaceSize ? String(current.candidate + 1) : "—"} copy={false} />
          </div>

          <div className="mt-4 grid gap-3">
            <ValueRow label="Known plaintext" value={activePlaintextHex} />
            <ValueRow label="Target ciphertext" value={knownPairs[0].ciphertextHex} />
            <ValueRow label="Recovered candidate" value={match?.candidate.toString() ?? "Run the bounded search"} />
            <ValueRow label="Recovered 64-bit DES key (with parity)" value={match?.keyHex ?? "—"} />
          </div>

          {predictionFeedback && <p className="mt-3 rounded-md border border-violet-200 bg-violet-50 p-3 text-sm font-semibold text-violet-900">{predictionFeedback}</p>}
        </Card>
      </div>

      <Card title="64 stored key bits versus 56 effective bits">
        <p className="mb-4 text-sm text-slate-600">
          Each DES key byte contains seven effective bits plus one odd-parity bit. PC-1 discards the eight parity positions before producing the 56-bit key state.
        </p>
        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <div>
            <div className="mb-2 flex flex-wrap gap-2"><StatusPill tone="info">Gray = fixed</StatusPill><StatusPill tone="warning">Violet = variable</StatusPill></div>
            <BitStrip bits={effectiveBits} variableBits={variableBits} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {(currentKey.keyHex.match(/../g) ?? []).map((byte, index) => (
              <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-2 font-mono text-xs">
                Byte {index + 1}: <strong>{hexToBits(byte, 8).slice(0, 7)}</strong><span className="text-rose-700"> {hexToBits(byte, 8).slice(7)}</span>
                <div className="mt-1 text-[10px] text-slate-500">7 effective + parity</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill tone={hasOddDesParity(currentKey.keyHex) ? "success" : "error"}>{hasOddDesParity(currentKey.keyHex) ? "Odd parity valid" : "Parity invalid"}</StatusPill>
          <StatusPill tone={classifyDesKey(currentKey.keyHex) === "ordinary" ? "info" : "warning"}>Key class: {classifyDesKey(currentKey.keyHex)}</StatusPill>
          <StatusPill tone="info">PC-1: 64 stored bits → 56 effective bits</StatusPill>
        </div>
      </Card>

      <Card title="Candidate verification trace" action={<span className="meta-pill">Capped at 24 representative rows</span>}>
        <p className="mb-3 text-sm text-slate-600">
          The trace retains early, periodic, and matching attempts. It does not render thousands of rows or animate the full brute-force loop.
        </p>
        <div className="hidden overflow-auto rounded-md border border-slate-200 md:block">
          <table className="w-full text-sm">
            <caption className="sr-only">Representative DES brute-force key attempts</caption>
            <thead className="bg-slate-100">
              <tr><th className="p-2 text-left">Candidate</th><th className="p-2 text-left">Binary suffix</th><th className="p-2 text-left">DES key</th><th className="p-2 text-left">Produced ciphertext</th><th className="p-2 text-left">Distance</th><th className="p-2 text-left">Result</th></tr>
            </thead>
            <tbody>
              {sampleRows.map((row) => (
                <tr key={row.candidate} className={`border-t border-slate-100 ${row.matches ? "bg-emerald-50" : ""}`}>
                  <td className="p-2 font-mono">{row.candidate}</td>
                  <td className="p-2 font-mono">{row.candidateBits}</td>
                  <td className="p-2 font-mono">{row.keyHex}</td>
                  <td className="p-2 font-mono">{row.ciphertextHex}</td>
                  <td className="p-2 font-mono">{row.hammingDistance}/64</td>
                  <td className="p-2 font-semibold">{row.matches ? `match (${row.pairMatches}/${knownPairs.length} pairs)` : "continue"}</td>
                </tr>
              ))}
              {!sampleRows.length && <tr><td className="p-4 text-slate-500" colSpan={6}>Start the search to inspect representative candidates.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 md:hidden">
          {sampleRows.map((row) => (
            <article key={row.candidate} className={`rounded-md border p-3 ${row.matches ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
              <div className="flex justify-between gap-2"><strong>Candidate {row.candidate}</strong><span>{row.matches ? "match" : `${row.hammingDistance}/64 different`}</span></div>
              <div className="mt-2 break-all font-mono text-xs">{row.keyHex}</div>
              <div className="mt-1 break-all font-mono text-xs text-slate-500">{row.ciphertextHex}</div>
            </article>
          ))}
          {!sampleRows.length && <p className="text-sm text-slate-500">Start the search to inspect representative candidates.</p>}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Ciphertext difference and avalanche effect">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="info">Current distance: {current?.hammingDistance ?? 0}/64 bits</StatusPill>
            <StatusPill tone="info">Adjacent-key distance: {avalancheDistance}/64 bits</StatusPill>
          </div>
          <p className="my-3 text-sm text-slate-600">Amber cells differ from the target. A wrong candidate can look random yet still fail the exact 64-bit comparison.</p>
          <CipherBitComparison target={knownPairs[0].ciphertextHex} produced={current?.ciphertextHex ?? knownPairs[0].ciphertextHex} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ValueRow label="Target-key ciphertext" value={knownPairs[0].ciphertextHex} />
            <ValueRow label="Adjacent-key ciphertext" value={adjacentCiphertext} />
          </div>
        </Card>

        <Card title="Best, average, and worst cases">
          <div className="grid gap-3 sm:grid-cols-3">
            <ValueRow label="Best case" value={`${expectation.best} attempt`} copy={false} />
            <ValueRow label="Average case" value={`≈ ${expectation.average.toLocaleString()} attempts`} copy={false} />
            <ValueRow label="Worst case" value={`${expectation.worst.toLocaleString()} attempts`} copy={false} />
          </div>
          <div className="mt-4 space-y-3">
            {searchBitOptions.map((bits) => (
              <div key={bits}>
                <div className="mb-1 flex justify-between text-xs font-semibold"><span>{bits} variable bits</span><span>2^{bits} = {(2 ** bits).toLocaleString()}</span></div>
                <div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-violet-500" style={{ width: `${(bits / DES_BRUTE_FORCE_MAX_BITS) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">Adding one variable bit doubles the bar&apos;s candidate count, even though its visual width grows linearly.</p>
        </Card>
      </div>

      {match && recoveredTrace && (
        <Card
          title="Recovered-key DES inspection"
          action={<button className="btn" type="button" onClick={() => setShowRounds((value) => !value)}><Eye className="h-4 w-4" /> {showRounds ? "Hide" : "Show"} 16 rounds</button>}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <ValueRow label="Initial permutation" value={recoveredTrace.initialPermutation} />
            <ValueRow label="Pre-output R16 || L16" value={recoveredTrace.preOutput} />
            <ValueRow label="Final ciphertext" value={recoveredTrace.outputHex} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {recoveredTrace.roundKeys.map((roundKey, index) => (
              <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Round {index + 1} key</div>
                <div className="mt-1 break-all font-mono text-xs">{BigInt(`0b${roundKey}`).toString(16).padStart(12, "0")}</div>
              </div>
            ))}
          </div>
          {showRounds && (
            <div className="mt-4 overflow-auto rounded-md border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-100"><tr><th className="p-2 text-left">Round</th><th className="p-2 text-left">L</th><th className="p-2 text-left">R</th><th className="p-2 text-left">Expanded R</th><th className="p-2 text-left">S-box output</th><th className="p-2 text-left">Next R</th></tr></thead>
                <tbody>{recoveredTrace.rounds.map((round) => (
                  <tr key={round.round} className="border-t border-slate-100">
                    <td className="p-2 font-mono">{round.round}</td>
                    <td className="p-2 font-mono">{round.left}</td>
                    <td className="p-2 font-mono">{round.right}</td>
                    <td className="p-2 font-mono">{round.expanded}</td>
                    <td className="p-2 font-mono">{round.sbox}</td>
                    <td className="p-2 font-mono">{round.nextRight}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <Card title="Timing projections—not guarantees">
        <p className="mb-4 text-sm text-slate-600">Measured browser throughput depends on the device and implementation. The rates below are illustrative comparisons, not promises about particular hardware.</p>
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Illustrative rate</th><th className="p-2 text-left">Toy worst case</th><th className="p-2 text-left">Full DES average</th><th className="p-2 text-left">Full DES worst case</th></tr></thead>
            <tbody>{hardwareRates.map((hardware) => (
              <tr key={hardware.label} className="border-t border-slate-100">
                <td className="p-2"><strong>{hardware.label}</strong><div className="font-mono text-xs text-slate-500">{hardware.rate.toExponential(0)} keys/s</div></td>
                <td className="p-2 font-mono">{formatDuration(estimatedSeconds(keySpaceSize, hardware.rate))}</td>
                <td className="p-2 font-mono">{formatDuration(estimatedSeconds(DES_FULL_KEY_SPACE / 2, hardware.rate))}</td>
                <td className="p-2 font-mono">{formatDuration(estimatedSeconds(DES_FULL_KEY_SPACE, hardware.rate))}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>

      <Card title="Key-space comparison and migration lesson">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Toy lab", `2^${variableBits}`, "Bounded classroom suffix"],
            ["DES", "2^56", "Obsolete exhaustive-search resistance"],
            ["2-key 3DES", "≈2^112", "Legacy; meet-in-the-middle considerations"],
            ["AES-128", "2^128", "Modern key size"],
          ].map(([name, size, note]) => (
            <div key={name} className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold">{name}</div>
              <div className="mt-2 font-mono text-xl font-bold text-teal-800">{size}</div>
              <p className="mt-2 text-xs text-slate-600">{note}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4"><strong>Double DES warning</strong><p className="mt-1 text-sm">Meet-in-the-middle analysis prevents Double DES from delivering a simple 112-bit security upgrade.</p></div>
          <div className="rounded-md border border-slate-200 bg-white p-4"><strong>Historical milestone</strong><p className="mt-1 text-sm">The EFF&apos;s Deep Crack demonstrated a DES key search in 1998, reinforcing that 56 effective bits were inadequate.</p></div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4"><strong>Defensive choice</strong><p className="mt-1 text-sm">Use authenticated encryption such as AES-GCM with correct nonce management. Do not migrate to DES variants.</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/algorithms/symmetric/aes">Open AES workbench</Link>
          <Link className="btn" to="/algorithms/modes/gcm">Study AES-GCM</Link>
          <Link className="btn" to="/algorithms/symmetric/des-full-step">Review full DES rounds</Link>
        </div>
      </Card>

      <CheckpointQuiz questions={checkpointQuestions} />

      <Card title="Classroom report and safety recap" action={<button className="btn" type="button" onClick={() => downloadText("des-brute-force-classroom-report.md", report)}><Download className="h-4 w-4" /> Download redacted report</button>}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>The page uses only locally generated toy targets and at most 12 variable effective-key bits.</li>
          <li>The search worker keeps the interface responsive and supports pause, resume, cancellation, and single-step inspection.</li>
          <li>Parity bits affect key representation, not DES&apos;s 56-bit security strength.</li>
          <li>A successful classroom search demonstrates why short key spaces fail; it does not make DES appropriate for new systems.</li>
          <li>The defensive conclusion is migration to authenticated modern encryption, normally AES-GCM where its nonce rules can be satisfied.</li>
        </ul>
      </Card>
    </div>
  );
}
