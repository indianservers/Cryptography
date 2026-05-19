import { Link } from "react-router-dom";
import { navigationItems } from "../data/navigation";

export default function NotFoundPage() {
  const popularRoutes = ["/algorithms/symmetric/aes", "/algorithms/asymmetric/rsa", "/algorithms/hash/sha-256-step", "/algorithms/modes/gcm"];
  const popular = popularRoutes.map((route) => navigationItems.find((item) => item.route === route)).filter(Boolean);

  return (
    <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">404</p>
      <h1 className="mt-2 text-2xl font-bold">Route not found</h1>
      <p className="mt-2 max-w-2xl text-slate-600">That cryptography module is not in the router. You can return home, use the sidebar search, or jump into one of the common modules below.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link className="btn btn-primary" to="/">Return home</Link>
        <Link className="btn" to="/?focusSearch=1">Search algorithms</Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((item) => item && <Link key={item.route} to={item.route} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900">{item.label}</Link>)}
      </div>
    </div>
  );
}
