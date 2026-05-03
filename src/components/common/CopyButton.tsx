import { Copy } from "lucide-react";
export function CopyButton({ value }: { value: string }) {
  return <button className="btn" onClick={() => navigator.clipboard?.writeText(value)}><Copy className="h-4 w-4" /> Copy output</button>;
}

