import { useEffect, useState } from "react";

export function DisplayControls() {
  const [compact, setCompact] = useState(() => localStorage.getItem("display-compact") === "true");
  const [darkTables, setDarkTables] = useState(() => localStorage.getItem("display-dark-tables") === "true");
  useEffect(() => {
    document.body.classList.toggle("compact-mode", compact);
    document.body.classList.toggle("dark-tables", darkTables);
    localStorage.setItem("display-compact", String(compact));
    localStorage.setItem("display-dark-tables", String(darkTables));
  }, [compact, darkTables]);
  return (
    <div className="flex flex-wrap gap-2">
      <button className={`btn ${compact ? "bg-cyan-50" : ""}`} onClick={() => setCompact((value) => !value)}>Compact {compact ? "on" : "off"}</button>
      <button className={`btn ${darkTables ? "bg-slate-900 text-white" : ""}`} onClick={() => setDarkTables((value) => !value)}>Dark tables {darkTables ? "on" : "off"}</button>
      <button className="btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Top</button>
    </div>
  );
}
