export function BinaryViewer({ value }: { value: string }) {
  return <pre className="overflow-auto rounded-md bg-slate-900 p-4 font-mono text-xs leading-6 text-lime-100">{value}</pre>;
}

