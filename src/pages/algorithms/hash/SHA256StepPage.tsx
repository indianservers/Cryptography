import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex, utf8 } from "../../../lib/cryptoDemos";

const kPreview = ["428a2f98","71374491","b5c0fbcf","e9b5dba5","3956c25b","59f111f1","923f82a4","ab1c5ed5"];
const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));

export default function SHA256StepPage() {
  const [message, setMessage] = useState("abc");
  const [digest, setDigest] = useState("");
  useEffect(() => {
    digestHex("SHA-256", message).then(setDigest).catch((error) => setDigest(error instanceof Error ? error.message : "SHA-256 failed"));
  }, [message]);
  const bytes = Array.from(utf8.encode(message));
  const bitLength = bytes.length * 8;
  const padded = useMemo(() => {
    const data = [...bytes, 0x80];
    while ((data.length + 8) % 64 !== 0) data.push(0);
    const len = BigInt(bitLength);
    for (let shift = 56; shift >= 0; shift -= 8) data.push(Number((len >> BigInt(shift)) & 255n));
    return data;
  }, [bitLength, bytes]);
  const words = Array.from({ length: 16 }, (_, index) => padded.slice(index * 4, index * 4 + 4).reduce((acc, byte) => ((acc << 8) | byte) >>> 0, 0));
  const schedule = [...words];
  while (schedule.length < 64) {
    const s0 = rotr(schedule[schedule.length - 15], 7) ^ rotr(schedule[schedule.length - 15], 18) ^ (schedule[schedule.length - 15] >>> 3);
    const s1 = rotr(schedule[schedule.length - 2], 17) ^ rotr(schedule[schedule.length - 2], 19) ^ (schedule[schedule.length - 2] >>> 10);
    schedule.push((schedule[schedule.length - 16] + s0 + schedule[schedule.length - 7] + s1) >>> 0);
  }
  const avalanche = digest.slice(0, 16).split("").filter((char, index) => char !== digest.slice(16, 32)[index]).length * 4;

  return (
    <div className="space-y-6">
      <PageHeader title="SHA-256 Step Visualizer" category="Hash Functions" status="Modern">A real Web Crypto SHA-256 digest with visible UTF-8 bytes, padding, length field, message schedule words, and compression-function vocabulary.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Message input">
          <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
        </Card>
        <Card title="Digest output">
          <div className="space-y-3">
            <ValueRow label="SHA-256 digest" value={digest} />
            <ValueRow label="Message length" value={`${bytes.length} bytes / ${bitLength} bits`} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="UTF-8 bytes and padding">
          <MatrixView columns={8} values={padded.slice(0, 64).map((byte) => byte.toString(16).padStart(2, "0"))} changed={[bytes.length]} />
        </Card>
        <Card title="Constants K[0..7] preview">
          <MatrixView columns={4} values={kPreview} />
        </Card>
      </div>
      <Card title="64-word message schedule">
        <div className="grid max-h-96 grid-cols-2 gap-2 overflow-auto md:grid-cols-4 xl:grid-cols-8">{schedule.map((word, index) => <div key={index} className="rounded-md bg-slate-50 p-2 font-mono text-xs"><span className="text-slate-500">W{index}</span><br />{word.toString(16).padStart(8, "0")}</div>)}</div>
      </Card>
      <Card title="Compression functions">
        <div className="grid gap-3 md:grid-cols-4">{["Ch(e,f,g)", "Maj(a,b,c)", "Σ0(a)", "Σ1(e)"].map((name) => <div key={name} className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="font-mono font-semibold">{name}</div><p className="mt-2 text-sm text-slate-600">Built from bitwise rotations, shifts, AND, XOR, and NOT.</p></div>)}</div>
        <p className="mt-4 text-sm text-slate-600">Avalanche preview from digest halves: about <span className="font-mono">{avalanche}</span> nibble bits differ in this display heuristic.</p>
      </Card>
      <WarningBadge>SHA-256 is a hash, not encryption. It has no key and cannot be reversed to recover the original message.</WarningBadge>
    </div>
  );
}
