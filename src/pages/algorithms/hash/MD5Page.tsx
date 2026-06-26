import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";
import { bytesToHex, md5 } from "../../../lib/hashCores";

export default function MD5Page() {
  const [message, setMessage] = useState("abc");
  const [roundLimit, setRoundLimit] = useState(16);
  const result = useMemo(() => md5(message), [message]);
  const paddedBytes = result.padded.slice(0, 64).map((byte) => byte.toString(16).padStart(2, "0"));

  return (
    <div className="space-y-6">
      <PageHeader title="MD5" category="Hash Functions" status="Deprecated">Compute MD5 with a custom browser-only TypeScript implementation and inspect the real padded block and round state. MD5 is broken for adversarial integrity.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Message input">
          <div className="grid gap-4">
            <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Visible rounds"><input className="field font-mono" type="number" min={1} max={64} value={roundLimit} onChange={(event) => setRoundLimit(Number(event.target.value))} /></Field>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={() => setMessage("abc")}>MD5 abc sample</button><button className="btn" onClick={() => setMessage("")}>Empty message</button></div>
          </div>
        </Card>
        <Card title="MD5 digest">
          <div className="grid gap-3">
            <ValueRow label="Digest hex" value={result.digest} />
            <ValueRow label="Message bytes" value={`${new TextEncoder().encode(message).length}`} />
            <ValueRow label="Padded first block" value={bytesToHex(result.padded.slice(0, 64))} />
          </div>
        </Card>
      </div>
      <Card title="512-bit block after MD5 padding">
        <MatrixView columns={8} values={paddedBytes} changed={[new TextEncoder().encode(message).length]} />
      </Card>
      <Card title="Why MD5 is outdated">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-rose-950">
            <div className="text-xs font-semibold uppercase">Collision attacks are practical</div>
            <p className="mt-2 text-sm">Attackers can create different files that share the same MD5 digest, so MD5 cannot reliably prove that content is unchanged.</p>
          </div>
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <div className="text-xs font-semibold uppercase">Famous failure</div>
            <p className="mt-2 text-sm">In 2008, researchers demonstrated a rogue certificate authority certificate using an MD5 collision, showing why MD5 was unsafe for certificates and signatures.</p>
          </div>
        </div>
      </Card>
      <Card title="Round operations">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">i</th><th className="p-2 text-left">Function</th><th className="p-2 text-left">M[g]</th><th className="p-2 text-left">A</th><th className="p-2 text-left">B</th><th className="p-2 text-left">C</th><th className="p-2 text-left">D</th></tr></thead>
            <tbody>{result.rounds.slice(0, roundLimit).map((round) => <tr key={round.i} className="border-t border-slate-100"><td className="p-2 font-mono">{round.i}</td><td className="p-2 font-mono">{round.f}</td><td className="p-2 font-mono">{round.g}</td><td className="p-2 font-mono">{round.a}</td><td className="p-2 font-mono">{round.b}</td><td className="p-2 font-mono">{round.c}</td><td className="p-2 font-mono">{round.d}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>MD5 has practical collision attacks. Use this page to learn the compression structure, not to protect files, passwords, signatures, or certificates.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="MD5" data={{ message, digest: result.digest, padded: result.padded, rounds: result.rounds }} /></div>
      </Card>
    </div>
  );
}
