import { Copy } from "lucide-react";
export function CopyButton({ value, label = "Copy output" }: { value: string; label?: string }) {
  return <button className="btn btn-primary" onClick={() => navigator.clipboard?.writeText(value)}><Copy className="h-4 w-4" /> {label}</button>;
}
