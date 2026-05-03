export function StateTransitionTable({ rows }: { rows: { label: string; before: string; after: string }[] }) {
  return <table className="w-full overflow-hidden rounded-md border border-slate-200 text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">Before</th><th className="p-2 text-left">After</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label} className="border-t border-slate-200"><td className="p-2 font-semibold">{row.label}</td><td className="p-2 font-mono">{row.before}</td><td className="p-2 font-mono">{row.after}</td></tr>)}</tbody></table>;
}

