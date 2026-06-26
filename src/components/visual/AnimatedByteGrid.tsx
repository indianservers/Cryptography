export interface ByteCell {
  id: string;
  label?: string;
  value: string;
  group?: string;
}

export function AnimatedByteGrid({ cells, activeCellIds, chunkSize = 8, caption }: { cells: ByteCell[]; activeCellIds: string[]; chunkSize?: number; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white p-3">
      {caption && <div className="mb-3 text-sm font-semibold text-slate-700">{caption}</div>}
      <div className="grid min-w-max gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, chunkSize)}, minmax(2.5rem, 1fr))` }}>
        {cells.map((cell) => {
          const active = activeCellIds.includes(cell.id);
          return (
            <div key={cell.id} className={`rounded-md border p-2 text-center font-mono text-xs ${active ? "border-teal-400 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
              {active && <div className="mb-1 font-sans text-[10px] font-bold uppercase text-teal-800">Current</div>}
              {cell.label && <div className="font-sans text-[10px] uppercase text-slate-500">{cell.label}</div>}
              <div className="crypto-wrap font-bold">{cell.value}</div>
              {cell.group && <div className="mt-1 font-sans text-[10px] text-slate-500">{cell.group}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
