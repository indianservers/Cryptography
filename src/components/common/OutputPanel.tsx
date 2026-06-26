import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ResponsiveDataBlock } from "./ResponsiveDataBlock";
import { ValidationMessage } from "./ValidationMessage";

export function OutputPanel({
  title = "Output",
  description,
  finalOutput,
  intermediate,
  warning,
  children,
  copyable = false,
  secretRisk = false,
  collapsible = true,
  defaultOpen = true,
}: {
  title?: string;
  description?: string;
  finalOutput?: string;
  intermediate?: Array<{ label: string; value: string }>;
  warning?: string;
  children?: React.ReactNode;
  copyable?: boolean;
  secretRisk?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id="output" className="rounded-md border border-teal-100 bg-white p-5 shadow-sm">
      <button type="button" className="mb-4 flex w-full items-center gap-2 text-left" onClick={() => collapsible && setOpen((current) => !current)} aria-expanded={open}>
        {collapsible && <ChevronDown className={`h-4 w-4 text-teal-700 transition ${open ? "" : "-rotate-90"}`} />}
        <span>
          <h2 className="text-lg font-semibold text-teal-950">{title}</h2>
          {description && <span className="mt-1 block text-sm font-normal text-slate-600">{description}</span>}
        </span>
      </button>
      {open && (
        <div className="space-y-4">
          {warning && <ValidationMessage tone="warning" message={warning} />}
          {finalOutput !== undefined && <ResponsiveDataBlock label="Final output" value={finalOutput} copyable={copyable} secretRisk={secretRisk} />}
          {intermediate && intermediate.length > 0 && (
            <div className="grid gap-3">
              {intermediate.map((item) => <ResponsiveDataBlock key={item.label} label={item.label} value={item.value} copyable={copyable} secretRisk={secretRisk} />)}
            </div>
          )}
          {children}
        </div>
      )}
    </section>
  );
}
