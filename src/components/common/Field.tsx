import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";

export function Field({ label, children, hint, value, expectedBytes }: { label: string; children: React.ReactNode; hint?: string; value?: string; expectedBytes?: number }) {
  const byteLength = value ? new TextEncoder().encode(value).length : undefined;
  const byteTone = expectedBytes === undefined || byteLength === undefined ? "text-slate-500" : byteLength === expectedBytes ? "text-emerald-700" : "text-amber-700";
  return (
    <label className="label">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span>{label}</span>
        {byteLength !== undefined && <span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${byteTone}`}>{byteLength}{expectedBytes ? `/${expectedBytes}` : ""} bytes</span>}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs font-medium text-slate-500">{hint}</span>}
    </label>
  );
}

export function Card({ title, children, eyebrow, action, collapsible = true, defaultOpen = true }: { title: string; children: React.ReactNode; eyebrow?: string; action?: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <button type="button" className="group flex min-w-0 flex-1 items-start gap-2 text-left" onClick={() => collapsible && setOpen((current) => !current)} aria-expanded={open}>
          {collapsible && <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-slate-500 transition ${open ? "" : "-rotate-90"}`} />}
          <span className="min-w-0">
            {eyebrow && <span className="block text-xs font-semibold uppercase text-teal-700">{eyebrow}</span>}
            <span className="block text-lg font-semibold group-hover:text-teal-800">{title}</span>
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {action}
        </div>
      </div>
      {open && children}
    </section>
  );
}

export function StatusPill({ tone = "info", children }: { tone?: "info" | "success" | "warning" | "error"; children: React.ReactNode }) {
  const toneClass = tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : tone === "warning" ? "border-amber-200 bg-amber-50 text-amber-900" : tone === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-teal-200 bg-teal-50 text-teal-800";
  return <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${toneClass}`}>{children}</span>;
}

export function ValueRow({ label, value, copy = true }: { label: string; value: string; copy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const copyValue = async () => {
    await navigator.clipboard?.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
        {copy && <button className="icon-btn h-8 w-8" title={`Copy ${label}`} type="button" onClick={copyValue}>{copied ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}</button>}
      </div>
      <div className="mt-1 break-all font-mono text-sm">{value}</div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
        <span>{value.length} chars</span>
        <span>{new TextEncoder().encode(value).length} bytes</span>
      </div>
    </div>
  );
}
