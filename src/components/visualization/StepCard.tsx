export function StepCard({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-md border border-slate-200 bg-white p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-600">{detail}</p></div>;
}

