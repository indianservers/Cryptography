import { Download } from "lucide-react";
export function DownloadButton({ filename, value }: { filename: string; value: string }) {
  return <button className="btn" onClick={() => { const url = URL.createObjectURL(new Blob([value], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }}><Download className="h-4 w-4" /> Download</button>;
}

