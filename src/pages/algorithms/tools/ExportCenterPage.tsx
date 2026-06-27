import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

export default function ExportCenterPage() {
  const [format, setFormat] = useState("JSON");
  const [scope, setScope] = useState("Current page summary");
  const [redact, setRedact] = useState(true);
  const [success, setSuccess] = useState("");
  const payload = useMemo(() => ({
    format,
    scope,
    redactedInputs: redact,
    included: ["route", "title", "algorithm status", "exactness note", "safety notes", "timestamp", "step summary"],
    excludedWhenRedacted: redact ? ["keys", "passwords", "plaintext", "tokens"] : [],
    timestamp: new Date().toISOString(),
  }), [format, redact, scope]);

  return (
    <div className="space-y-6">
      <PageHeader title="Export Center" category="Export Center" status="Educational">Review what will be included before downloading learning artifacts.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Export settings">
          <div className="grid gap-4">
            <Field label="Format"><select className="field" value={format} onChange={(event) => setFormat(event.target.value)}><option>JSON</option><option>Markdown</option><option>CSV</option></select></Field>
            <Field label="Scope"><select className="field" value={scope} onChange={(event) => setScope(event.target.value)}><option>Current page summary</option><option>Saved experiments</option><option>Step table only</option></select></Field>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700"><input type="checkbox" checked={redact} onChange={(event) => setRedact(event.target.checked)} /> Redact user inputs by default</label>
            <button className="btn btn-primary w-fit" type="button" onClick={() => setSuccess(`${format} export prepared successfully.`)}>Prepare export</button>
            {success && <StatusPill tone="success">{success}</StatusPill>}
          </div>
        </Card>
        <Card title="Included before download">
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Route and title" value="included" />
            <ValueRow label="Status and exactness" value="included" />
            <ValueRow label="Safety notes" value="included" />
            <ValueRow label="Timestamp" value="included" />
            <ValueRow label="User input handling" value={redact ? "redacted" : "included after review"} />
            <ValueRow label="Selected format" value={format} />
          </div>
          <div className="mt-4"><ExportReportButton title="Export center preview" data={payload} /></div>
        </Card>
      </div>
      <Card title="Redaction checklist">
        <div className="grid gap-2 text-sm md:grid-cols-4">
          {["keys", "passwords", "plaintext", "tokens"].map((item) => <div key={item} className={`rounded-md border p-3 ${redact ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-amber-300 bg-amber-50 text-amber-950"}`}>{redact ? "Redacted: " : "Review: "}{item}</div>)}
        </div>
      </Card>
      <WarningBadge>Review exports before sharing because learning artifacts can accidentally include sensitive material.</WarningBadge>
    </div>
  );
}
