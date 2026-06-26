export interface FlowNode {
  id: string;
  label: string;
  detail?: string;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export function AnimatedFlowDiagram({ nodes, edges, activeNodeIds, activeEdgeIds, reducedMotion }: { nodes: FlowNode[]; edges: FlowEdge[]; activeNodeIds: string[]; activeEdgeIds: string[]; reducedMotion?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {nodes.map((node) => {
          const active = activeNodeIds.includes(node.id);
          return (
            <div key={node.id} className={`rounded-md border p-3 transition ${!reducedMotion ? "duration-300" : ""} ${active ? "border-teal-400 bg-teal-50 text-teal-950 shadow-sm" : "border-slate-200 bg-white text-slate-700"}`}>
              <div className="flex flex-wrap items-center gap-2">
                {active && <span className="rounded-full border border-teal-200 bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-teal-800">Current</span>}
                <span className="font-bold">{node.label}</span>
              </div>
              {node.detail && <p className="mt-1 text-sm text-slate-600">{node.detail}</p>}
            </div>
          );
        })}
      </div>
      {edges.length > 0 && (
        <div className="grid gap-2 md:grid-cols-2">
          {edges.map((edge) => {
            const active = activeEdgeIds.includes(edge.id);
            const from = nodes.find((node) => node.id === edge.from)?.label ?? edge.from;
            const to = nodes.find((node) => node.id === edge.to)?.label ?? edge.to;
            return (
              <div key={edge.id} className={`rounded-md border p-2 text-sm ${active ? "border-blue-300 bg-blue-50 text-blue-950" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                <span className="font-semibold">{active ? "Active path: " : "Path: "}</span>{from} -&gt; {to}{edge.label ? ` (${edge.label})` : ""}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
