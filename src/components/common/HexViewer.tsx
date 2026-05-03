export function HexViewer({ value }: { value: string }) {
  return <pre className="overflow-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-cyan-100">{value}</pre>;
}

