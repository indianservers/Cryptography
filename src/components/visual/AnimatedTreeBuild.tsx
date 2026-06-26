export interface TreeNode {
  id: string;
  label: string;
  value?: string;
}

export function AnimatedTreeBuild({ levels, activeNodeIds, activePairIds, rootId }: { levels: TreeNode[][]; activeNodeIds: string[]; activePairIds: string[]; rootId?: string }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white p-3">
      <div className="flex min-w-max flex-col-reverse gap-3">
        {levels.map((level, levelIndex) => (
          <div key={`level-${levelIndex}`} className="flex justify-center gap-2">
            {level.map((node) => {
              const active = activeNodeIds.includes(node.id) || activePairIds.includes(node.id);
              const root = rootId === node.id;
              return (
                <div key={node.id} className={`min-w-28 rounded-md border p-2 text-center text-sm ${root ? "border-emerald-400 bg-emerald-50 text-emerald-950" : active ? "border-teal-400 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
                  {(active || root) && <div className="text-[10px] font-bold uppercase">{root ? "Root" : "Current"}</div>}
                  <div className="font-semibold">{node.label}</div>
                  {node.value && <div className="crypto-wrap mt-1 font-mono text-xs">{node.value}</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
