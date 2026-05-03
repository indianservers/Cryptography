import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";
import { digestHex } from "../../../lib/cryptoDemos";
import { bytesToHex, sha1Schedule } from "../../../lib/hashCores";

export default function SHA1Page() {
  const [message, setMessage] = useState("abc");
  const [digest, setDigest] = useState("");
  const [roundLimit, setRoundLimit] = useState(20);
  const trace = useMemo(() => sha1Schedule(message), [message]);

  useEffect(() => {
    digestHex("SHA-1", message).then(setDigest).catch((error) => setDigest(error instanceof Error ? error.message : "SHA-1 failed"));
  }, [message]);

  return (
    <div className="space-y-6">
      <PageHeader title="SHA-1" category="Hash Functions" status="Deprecated">Compute the real SHA-1 digest with Web Crypto and inspect the real padding, 80-word message schedule, and compression working variables.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Message input">
          <div className="grid gap-4">
            <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Visible rounds"><input className="field font-mono" type="number" min={1} max={80} value={roundLimit} onChange={(event) => setRoundLimit(Number(event.target.value))} /></Field>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={() => setMessage("abc")}>SHA-1 abc sample</button><button className="btn" onClick={() => setMessage("")}>Empty message</button></div>
          </div>
        </Card>
        <Card title="Digest output">
          <div className="grid gap-3">
            <ValueRow label="SHA-1 digest" value={digest} />
            <ValueRow label="Padded first block" value={bytesToHex(trace.padded.slice(0, 64))} />
            <ValueRow label="Schedule words" value={`${trace.words.length}`} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Padded block bytes"><MatrixView columns={8} values={trace.padded.slice(0, 64).map((byte) => byte.toString(16).padStart(2, "0"))} changed={[new TextEncoder().encode(message).length]} /></Card>
        <Card title="80-word schedule preview"><div className="grid max-h-72 grid-cols-2 gap-2 overflow-auto md:grid-cols-4">{trace.words.map((word, index) => <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-2 font-mono text-xs"><span className="text-slate-500">W{index}</span><br />{word.toString(16).padStart(8, "0")}</div>)}</div></Card>
      </div>
      <Card title="Compression rounds">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">i</th><th className="p-2 text-left">W</th><th className="p-2 text-left">A</th><th className="p-2 text-left">B</th><th className="p-2 text-left">C</th><th className="p-2 text-left">D</th><th className="p-2 text-left">E</th></tr></thead><tbody>{trace.rounds.slice(0, roundLimit).map((round) => <tr key={round.i} className="border-t border-slate-100"><td className="p-2 font-mono">{round.i}</td><td className="p-2 font-mono">{round.w}</td><td className="p-2 font-mono">{round.a}</td><td className="p-2 font-mono">{round.b}</td><td className="p-2 font-mono">{round.c}</td><td className="p-2 font-mono">{round.d}</td><td className="p-2 font-mono">{round.e}</td></tr>)}</tbody></table>
        </div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>SHA-1 has practical collision attacks and should not be used for new signatures, certificates, or adversarial integrity checks.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="SHA-1" data={{ message, digest, trace }} /></div>
      </Card>
    </div>
  );
}
