import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function InputPanel({ title = "User input", children, collapsible = true, defaultOpen = true }: { title?: string; children: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id="input" className="rounded-md border border-slate-300 border-l-4 border-l-slate-500 bg-white p-5 shadow-sm">
      <button type="button" className="mb-4 flex w-full items-center gap-2 text-left" onClick={() => collapsible && setOpen((current) => !current)} aria-expanded={open}>
        {collapsible && <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "" : "-rotate-90"}`} />}
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </button>
      {open && children}
    </section>
  );
}
