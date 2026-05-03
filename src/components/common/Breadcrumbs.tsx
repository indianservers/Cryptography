import { Link, useLocation } from "react-router-dom";
import { findAlgorithm } from "../../data/algorithmMetadata";

const labelize = (segment: string) => segment.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");

export function Breadcrumbs() {
  const location = useLocation();
  const current = findAlgorithm(location.pathname);
  const segments = location.pathname.split("/").filter(Boolean);
  if (location.pathname === "/") return null;

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
      <Link className="font-medium text-cyan-700 hover:text-cyan-900" to="/">Home</Link>
      {segments.slice(0, -1).map((segment, index) => (
        <span key={`${segment}-${index}`} className="flex items-center gap-2"><span>/</span><span>{labelize(segment)}</span></span>
      ))}
      <span>/</span>
      <span className="font-semibold text-slate-900">{current?.label ?? labelize(segments[segments.length - 1] ?? "")}</span>
    </nav>
  );
}
