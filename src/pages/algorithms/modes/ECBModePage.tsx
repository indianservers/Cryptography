import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { textBlocks } from "../../../lib/cryptoDemos";

export default function ECBModePage() {
  const [plain, setPlain] = useState("BLOCK-ONE-123456BLOCK-ONE-123456different-block!!");
  const blocks = useMemo(() => textBlocks(plain, 16), [plain]);
  const repeated = blocks.filter((block, index) => blocks.indexOf(block) !== index);

  return (
    <div className="space-y-6">
      <PageHeader title="ECB Mode" category="Modes of Operation" status="Unsafe">ECB encrypts each block independently. This visualization detects repeated plaintext blocks to show why structure leaks.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Plaintext blocks"><Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field></Card>
        <Card title="Repeated block detection"><ValueRow label="Repeated block count" value={String(repeated.length)} /></Card>
      </div>
      <Card title="Independent block encryption flow">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{blocks.map((block, index) => <div key={`${block}-${index}`} className={`rounded-md border p-3 font-mono text-xs ${blocks.indexOf(block) !== index ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50"}`}><div className="mb-2 text-slate-500">P{index}</div>{block}<div className="mt-3 rounded bg-white p-2">E_k(P{index}) independently</div></div>)}</div>
      </Card>
      <WarningBadge>ECB reveals when plaintext blocks repeat. Use an authenticated mode such as GCM for normal message encryption.</WarningBadge>
    </div>
  );
}
