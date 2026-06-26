import type { ModuleArchetype } from "../../data/moduleArchetypes";
import { getModuleArchetype } from "../../data/moduleArchetypes";
import { getModuleAuditEntry } from "../../data/moduleAuditRegistry";

export function ModulePageFrame({
  route,
  category,
  children,
  archetype,
  aside,
  footer,
}: {
  route: string;
  category?: string;
  children: React.ReactNode;
  archetype?: ModuleArchetype;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const auditEntry = getModuleAuditEntry(route);
  const resolved = archetype ?? getModuleArchetype(route, category ?? auditEntry?.category ?? "", auditEntry);
  const layoutClass = aside ? "xl:grid-cols-[minmax(0,1fr)_18rem]" : "";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-0 pb-6">
      <section className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Archetype: {resolved.type.replace(/-/g, " ")}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Layout: {resolved.preferredInputLayout.replace(/-/g, " ")}</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Output: {resolved.outputStyle.replace(/-/g, " ")}</span>
          {resolved.needsScrollableOutput && <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Mobile-safe output</span>}
        </div>
      </section>
      <div className={`grid gap-6 ${layoutClass}`}>
        <div className="min-w-0 space-y-6">{children}</div>
        {aside && <aside className="min-w-0 space-y-4">{aside}</aside>}
      </div>
      {footer && <footer className="space-y-4">{footer}</footer>}
    </div>
  );
}
