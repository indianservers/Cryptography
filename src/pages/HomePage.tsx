import { Link } from "react-router-dom";
import { navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";

export default function HomePage() {
  const featured = navigationItems.filter((item) => ["/algorithms/symmetric/aes", "/algorithms/symmetric/des", "/algorithms/asymmetric/rsa", "/algorithms/hash/sha-256-step", "/algorithms/classical/caesar-cipher", "/algorithms/ecc/ecdsa"].includes(item.route));
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">No backend, no API crypto dependency</p>
        <h1 className="mt-2 text-3xl font-bold">Mega Cryptography Suite</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A browser-only learning lab with lazy-loaded algorithm pages, local Web Crypto operations where available, custom educational visualizers, and IndexedDB experiment storage.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((item) => <Link key={item.route} to={item.route} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{item.label}</h2><SecurityStatusBadge status={item.securityStatus} compact /></div><p className="text-sm text-slate-600">{item.category}</p></Link>)}
      </section>
    </div>
  );
}

