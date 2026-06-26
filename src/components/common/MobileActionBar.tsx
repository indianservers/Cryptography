export interface MobileAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "secondary" | "warning";
}

export function MobileActionBar({ actions }: { actions: MobileAction[] }) {
  if (!actions.length) return null;
  return (
    <div className="sticky bottom-2 z-20 flex gap-2 rounded-md border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur sm:hidden" style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          className={`btn flex-1 px-3 ${action.tone === "primary" ? "btn-primary" : action.tone === "warning" ? "btn-warning" : ""}`}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
