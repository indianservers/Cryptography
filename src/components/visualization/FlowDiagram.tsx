export function FlowDiagram({ nodes }: { nodes: string[] }) {
  return <div className="flex flex-wrap items-center gap-2">{nodes.map((node, index) => <div key={node} className="flex items-center gap-2"><span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm">{node}</span>{index < nodes.length - 1 && <span className="text-slate-400">{">"}</span>}</div>)}</div>;
}

