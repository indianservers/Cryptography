export function ValidationMessage({ tone = "info", message, details }: { tone?: "info" | "warning" | "error" | "success"; message: string; details?: string }) {
  const toneClass = tone === "success"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : tone === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-sky-200 bg-sky-50 text-sky-900";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-md border p-3 text-sm ${toneClass}`}>
      <div className="font-semibold">{message}</div>
      {details && <p className="mt-1 text-sm opacity-90">{details}</p>}
    </div>
  );
}
