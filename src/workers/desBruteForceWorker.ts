/// <reference lib="webworker" />

import {
  buildDesCandidateRow,
  DES_BRUTE_FORCE_MAX_BITS,
  type DesBruteForceRow,
  type DesKnownPair,
  type DesSearchSpeed,
  type DesWorkerCommand,
  type DesWorkerEvent,
} from "../lib/desBruteForce";

const worker = self as DedicatedWorkerGlobalScope;

let pairs: DesKnownPair[] = [];
let fixedEffectiveKey = 0n;
let variableBits = 8;
let keySpaceSize = 256;
let nextCandidate = 0;
let attempts = 0;
let startedAt = 0;
let pausedAt = 0;
let pausedDuration = 0;
let paused = false;
let cancelled = false;
let speed: DesSearchSpeed = "normal";
let sampleRows: DesBruteForceRow[] = [];
let current: DesBruteForceRow | null = null;

const settingsFor = (mode: DesSearchSpeed) => {
  if (mode === "slow") return { chunkSize: 1, delayMs: 160 };
  if (mode === "normal") return { chunkSize: 16, delayMs: 18 };
  return { chunkSize: 128, delayMs: 0 };
};

const elapsed = () => Math.max(0, performance.now() - startedAt - pausedDuration);
const post = (event: DesWorkerEvent) => worker.postMessage(event);

function remember(row: DesBruteForceRow) {
  const shouldKeep = row.candidate < 8 || row.matches || row.candidate % Math.max(1, Math.floor(keySpaceSize / 12)) === 0;
  if (shouldKeep && !sampleRows.some((item) => item.candidate === row.candidate)) {
    sampleRows = [...sampleRows, row].slice(-24);
  }
}

function report(status: "running" | "paused") {
  post({
    type: "progress",
    status,
    attempts,
    keySpaceSize,
    elapsedMs: elapsed(),
    current,
    sampleRows,
  });
}

function processCandidates(count: number) {
  for (let index = 0; index < count && nextCandidate < keySpaceSize; index += 1) {
    current = buildDesCandidateRow(pairs, fixedEffectiveKey, variableBits, nextCandidate);
    nextCandidate += 1;
    attempts += 1;
    remember(current);
    if (current.matches) {
      post({
        type: "complete",
        status: "found",
        attempts,
        keySpaceSize,
        elapsedMs: elapsed(),
        match: current,
        sampleRows,
      });
      return true;
    }
  }
  if (nextCandidate >= keySpaceSize) {
    post({
      type: "complete",
      status: "exhausted",
      attempts,
      keySpaceSize,
      elapsedMs: elapsed(),
      match: null,
      sampleRows,
    });
    return true;
  }
  return false;
}

function schedule() {
  if (cancelled || paused) return;
  const settings = settingsFor(speed);
  const complete = processCandidates(settings.chunkSize);
  if (!complete) {
    report("running");
    setTimeout(schedule, settings.delayMs);
  }
}

worker.onmessage = (event: MessageEvent<DesWorkerCommand>) => {
  const message = event.data;
  if (message.type === "start") {
    pairs = message.pairs;
    fixedEffectiveKey = BigInt(`0x${message.fixedEffectiveKeyHex}`);
    variableBits = Math.min(DES_BRUTE_FORCE_MAX_BITS, Math.max(1, Math.trunc(message.variableBits)));
    keySpaceSize = 2 ** variableBits;
    speed = message.speed;
    nextCandidate = 0;
    attempts = 0;
    sampleRows = [];
    current = null;
    cancelled = false;
    paused = false;
    pausedDuration = 0;
    startedAt = performance.now();
    report("running");
    schedule();
    return;
  }
  if (message.type === "pause" && !paused) {
    paused = true;
    pausedAt = performance.now();
    report("paused");
    return;
  }
  if (message.type === "resume" && paused) {
    paused = false;
    pausedDuration += performance.now() - pausedAt;
    report("running");
    schedule();
    return;
  }
  if (message.type === "cancel") {
    cancelled = true;
    post({ type: "cancelled", attempts, keySpaceSize, elapsedMs: elapsed() });
    return;
  }
  if (message.type === "step" && paused) {
    const complete = processCandidates(1);
    if (!complete) report("paused");
    return;
  }
  if (message.type === "speed") {
    speed = message.speed;
  }
};

export {};
