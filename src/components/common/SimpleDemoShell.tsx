import { RotateCcw, WandSparkles } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card, StatusPill, ValueRow } from "./Field";
import { WarningBadge } from "./WarningBadge";
import type { SecurityStatus } from "../../types";

export interface DemoField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
  error?: string;
}

export interface DemoOutput {
  label: string;
  value: string;
}

export function SimpleDemoShell({
  title,
  category = "Input/Output Demos",
  status,
  children,
  fields,
  outputs,
  notes,
  onSample,
  onReset,
}: {
  title: string;
  category?: string;
  status: SecurityStatus;
  children: React.ReactNode;
  fields: DemoField[];
  outputs: DemoOutput[];
  notes: string[];
  onSample?: () => void;
  onReset?: () => void;
}) {
  const errors = fields.map((field) => field.error).filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader title={title} category={category} status={status}>{children}</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="ASCII input" collapsible={false}>
          <div className="grid gap-4">
            {fields.map((field) => (
              <label key={field.label} className="label">
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea className={`field mt-1 min-h-28 ${field.error ? "border-amber-400 focus:border-amber-500 focus:ring-amber-100" : ""}`} value={field.value} onChange={(event) => field.onChange(event.target.value)} />
                ) : (
                  <input className={`field mt-1 ${field.error ? "border-amber-400 focus:border-amber-500 focus:ring-amber-100" : ""}`} value={field.value} onChange={(event) => field.onChange(event.target.value)} />
                )}
                {field.hint && <span className="mt-1 block text-xs font-medium text-slate-500">{field.hint}</span>}
                {field.error && <span className="mt-1 block text-xs font-semibold text-amber-700">{field.error}</span>}
              </label>
            ))}
            <div className="flex flex-wrap gap-2">
              {onSample && <button type="button" className="btn btn-primary" onClick={onSample}><WandSparkles className="h-4 w-4" /> Sample</button>}
              {onReset && <button type="button" className="btn" onClick={onReset}><RotateCcw className="h-4 w-4" /> Reset</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={errors.length ? "warning" : "success"}>{errors.length ? "Fix ASCII input" : "ASCII ready"}</StatusPill>
              <StatusPill tone={status === "Modern" ? "success" : status === "Deprecated" || status === "Unsafe" ? "error" : "info"}>{status}</StatusPill>
              <StatusPill>Input/output only</StatusPill>
            </div>
          </div>
        </Card>
        <Card title="Output" collapsible={false}>
          <div className="space-y-3">
            {outputs.map((output) => <ValueRow key={output.label} label={output.label} value={output.value || "Waiting for valid input"} />)}
          </div>
        </Card>
      </div>
      <WarningBadge>{notes.join(" ")}</WarningBadge>
    </div>
  );
}
