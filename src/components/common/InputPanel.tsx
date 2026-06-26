import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ValidationMessage } from "./ValidationMessage";

export function InputPanel({
  title = "User input",
  description,
  children,
  validationSummary,
  footerActions,
  collapsible = true,
  defaultOpen = true,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  validationSummary?: string;
  footerActions?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id="input" className="rounded-md border border-slate-300 border-l-4 border-l-slate-500 bg-white p-5 shadow-sm">
      <button type="button" className="mb-4 flex w-full items-center gap-2 text-left" onClick={() => collapsible && setOpen((current) => !current)} aria-expanded={open}>
        {collapsible && <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "" : "-rotate-90"}`} />}
        <span>
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          {description && <span className="mt-1 block text-sm font-normal text-slate-600">{description}</span>}
        </span>
      </button>
      {open && (
        <div className="space-y-4">
          {validationSummary && <ValidationMessage tone="warning" message={validationSummary} />}
          {children}
          {footerActions && <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-3">{footerActions}</div>}
        </div>
      )}
    </section>
  );
}
