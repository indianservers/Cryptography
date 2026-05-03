import { useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { vectorsFor } from "../../../../data/testVectors";

const hexToBytes = (value: string) => new Uint8Array(Array.from({ length: value.length / 2 }, (_, index) => parseInt(value.slice(index * 2, index * 2 + 2), 16)));
const bytesToHex = (value: Uint8Array | ArrayBuffer) => Array.from(value instanceof Uint8Array ? value : new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;

export default function AESTestVectorsPage() {
  const vectors = vectorsFor("AES");
  const [results, setResults] = useState<Record<string, string>>({});
  const run = async () => {
    const next: Record<string, string> = {};
    for (const vector of vectors) {
      try {
        const key = await crypto.subtle.importKey("raw", hexToBytes(String(vector.input.key)), "AES-CBC", false, ["encrypt"]);
        const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: hexToBytes(String(vector.input.iv)) }, key, toArrayBuffer(hexToBytes(String(vector.input.plaintextHex))));
        const actual = bytesToHex(encrypted);
        next[vector.id] = actual === vector.expected.ciphertextHex ? `PASS ${actual}` : `FAIL expected ${vector.expected.ciphertextHex}, got ${actual}`;
      } catch (error) {
        next[vector.id] = error instanceof Error ? error.message : "failed";
      }
    }
    setResults(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AES Test Vectors" category="Block Ciphers" status="Educational">Run known AES vectors in the browser and compare actual Web Crypto output to expected ciphertext.</PageHeader>
      <Card title="Vector runner">
        <button className="btn" onClick={run}>Run AES vectors</button>
        <div className="mt-5 grid gap-4">
          {vectors.map((vector) => <div key={vector.id} className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{vector.name}</h2><span className="text-xs text-slate-500">{vector.source}</span></div><div className="grid gap-3 md:grid-cols-2"><ValueRow label="Key" value={String(vector.input.key)} /><ValueRow label="Plaintext" value={String(vector.input.plaintextHex)} /><ValueRow label="Expected ciphertext" value={vector.expected.ciphertextHex} /><ValueRow label="Result" value={results[vector.id] ?? "not run"} /></div></div>)}
        </div>
      </Card>
      <WarningBadge>These vectors validate browser AES behavior for known inputs. They do not prove that every surrounding protocol choice is safe.</WarningBadge>
    </div>
  );
}
