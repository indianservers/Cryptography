export function InputPanel({ title = "User input", children }: { title?: string; children: React.ReactNode }) {
  return <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>{children}</section>;
}
