export function AnimatedMatrixTransform({ inputMatrix, operationMatrix, outputMatrix, activeCells, caption }: { inputMatrix: string[][]; operationMatrix?: string[][]; outputMatrix: string[][]; activeCells: string[]; caption?: string }) {
  const renderMatrix = (title: string, matrix: string[][], prefix: string) => (
    <div className="min-w-max rounded-md border border-slate-200 bg-white p-3">
      <div className="mb-2 text-xs font-bold uppercase text-slate-600">{title}</div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.max(1, matrix[0]?.length ?? 1)}, minmax(2.5rem, 1fr))` }}>
        {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
          const id = `${prefix}-${rowIndex}-${colIndex}`;
          const active = activeCells.includes(id);
          return <div key={id} className={`rounded border px-2 py-2 text-center font-mono text-sm ${active ? "border-teal-400 bg-teal-50 font-bold text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{active ? "Current " : ""}{value}</div>;
        }))}
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-3">
      {caption && <div className="mb-3 text-sm font-semibold text-slate-700">{caption}</div>}
      <div className="flex min-w-max items-start gap-3">
        {renderMatrix("Input", inputMatrix, "input")}
        {operationMatrix && renderMatrix("Operation", operationMatrix, "operation")}
        {renderMatrix("Output", outputMatrix, "output")}
      </div>
    </div>
  );
}
