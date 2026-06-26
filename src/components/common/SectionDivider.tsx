import type { LucideIcon } from "lucide-react";

export function SectionDivider({ title, description, icon: Icon }: { title: string; description?: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          {Icon && <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />}
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
    </div>
  );
}
