import { FileDown } from "lucide-react";
export function ExportReportButton({ title, data }: { title: string; data: unknown }) {
  return <button className="btn" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = `${title.toLowerCase().replace(/\W+/g, "-")}-report.json`; a.click(); URL.revokeObjectURL(url); }}><FileDown className="h-4 w-4" /> Export JSON</button>;
}

