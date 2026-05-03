import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex, utf8 } from "../../../lib/cryptoDemos";
import { sha256K, sha256Trace } from "../../../lib/hashCores";

export default function SHA256StepPage() {
  const [message, setMessage] = useState("abc");
  const [digest, setDigest] = useState("");
  const [roundLimit, setRoundLimit] = useState(16);
  useEffect(() => {
    digestHex("SHA-256", message).then(setDigest).catch((error) => setDigest(error instanceof Error ? error.message : "SHA-256 failed"));
  }, [message]);
  const bytes = Array.from(utf8.encode(message));
  const bitLength = bytes.length * 8;
  const trace = useMemo(() => sha256Trace(message), [message]);
  const avalanche = digest.slice(0, 16).split("").filter((char, index) => char !== digest.slice(16, 32)[index]).length * 4;

  return (
    <div className="space-y-6">
      <PageHeader title="SHA-256 Step Visualizer" category="Hash Functions" status="Modern">A real Web Crypto SHA-256 digest with visible UTF-8 bytes, padding, length field, message schedule words, and compression-function vocabulary.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Message input">
          <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
          <Field label="Visible compression rounds"><input className="field font-mono" type="number" min={1} max={64} value={roundLimit} onChange={(event) => setRoundLimit(Number(event.target.value))} /></Field>
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
          <MatrixView columns={8} values={trace.padded.slice(0, 64).map((byte) => byte.toString(16).padStart(2, "0"))} changed={[bytes.length]} />
        </Card>
        <Card title="Constants K[0..7] preview">
          <MatrixView columns={4} values={sha256K.slice(0, 8).map((word) => word.toString(16).padStart(8, "0"))} />
        </Card>
      </div>
      <Card title="64-word message schedule">
        <div className="grid max-h-96 grid-cols-2 gap-2 overflow-auto md:grid-cols-4 xl:grid-cols-8">{trace.schedule.map((word, index) => <div key={index} className="rounded-md bg-slate-50 p-2 font-mono text-xs"><span className="text-slate-500">W{index}</span><br />{word.toString(16).padStart(8, "0")}</div>)}</div>
      </Card>
      <Card title="64 compression rounds">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">i</th><th className="p-2 text-left">W</th><th className="p-2 text-left">K</th><th className="p-2 text-left">T1</th><th className="p-2 text-left">T2</th><th className="p-2 text-left">a</th><th className="p-2 text-left">e</th><th className="p-2 text-left">h</th></tr></thead><tbody>{trace.rounds.slice(0, roundLimit).map((round) => <tr key={round.i} className="border-t border-slate-100"><td className="p-2 font-mono">{round.i}</td><td className="p-2 font-mono">{round.w}</td><td className="p-2 font-mono">{round.k}</td><td className="p-2 font-mono">{round.t1}</td><td className="p-2 font-mono">{round.t2}</td><td className="p-2 font-mono">{round.a}</td><td className="p-2 font-mono">{round.e}</td><td className="p-2 font-mono">{round.h}</td></tr>)}</tbody></table>
        </div>
      </Card>
      <Card title="Compression functions">
        <div className="grid gap-3 md:grid-cols-4">{["Ch(e,f,g)", "Maj(a,b,c)", "Σ0(a)", "Σ1(e)"].map((name) => <div key={name} className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="font-mono font-semibold">{name}</div><p className="mt-2 text-sm text-slate-600">Built from bitwise rotations, shifts, AND, XOR, and NOT.</p></div>)}</div>
        <p className="mt-4 text-sm text-slate-600">Avalanche preview from digest halves: about <span className="font-mono">{avalanche}</span> nibble bits differ in this display heuristic.</p>
      </Card>
      <WarningBadge>SHA-256 is a hash, not encryption. It has no key and cannot be reversed to recover the original message.</WarningBadge>
    </div>
  );
}
