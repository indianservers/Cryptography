import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function InputPanel({ title = "User input", children, collapsible = true, defaultOpen = true }: { title?: string; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <button type="button" className="mb-4 flex w-full items-center gap-2 text-left" onClick={() => collapsible && setOpen((current) => !current)} aria-expanded={open}>
        {collapsible && <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "" : "-rotate-90"}`} />}
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </button>
      {open && children}
    </section>
  );
}
