import { Suspense, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Box, Braces, ChartBar, ChevronDown, Cpu, Database, FileKey, Fingerprint, Gauge, Hash, KeyRound, Layers, LockKeyhole, Menu, Network, Search, Shield, Shuffle, SquareCode, Waves, X, Zap } from "lucide-react";
import { navigationCategories, navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";
import { ImplementationBadge } from "../components/common/ImplementationBadge";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { PrivacyBanner } from "../components/common/PrivacyBanner";
import { PageChrome } from "../components/common/PageChrome";

const icons = { Shield, BookOpen, LockKeyhole, Waves, KeyRound, Fingerprint, Hash, FileKey, Database, Network, ChartBar, Zap, Box, Layers, SquareCode, Braces, Shuffle, Gauge, Cpu };

const categoryIcon: Record<string, keyof typeof icons> = {
  "Classical Cryptography": "BookOpen",
  "Symmetric Cryptography": "LockKeyhole",
  "Block Ciphers": "Box",
  "Stream Ciphers": "Waves",
  "Public Key Cryptography": "KeyRound",
  "Elliptic Curve Cryptography": "Fingerprint",
  "Hash Functions": "Hash",
  "MAC Algorithms": "FileKey",
  "Key Derivation Functions": "KeyRound",
  "Modes of Operation": "Layers",
  "Padding Schemes": "SquareCode",
  "Encoding Tools": "Braces",
  "Certificates and PKI": "Shield",
  "Cryptanalysis and Attacks": "Zap",
  "Blockchain Cryptography": "Network",
  "Randomness and Entropy": "Shuffle",
  "Benchmark and Comparison": "Gauge",
  "Saved Experiments": "Database",
  "Export Center": "ChartBar",
};

export default function RootLayout() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const grouped = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return navigationCategories.map((category) => ({
      category,
      items: navigationItems.filter((item) => item.category === category && (!normalized || item.label.toLowerCase().includes(normalized) || item.securityStatus.toLowerCase().includes(normalized))),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <aside className={`fixed inset-y-0 left-0 z-40 w-80 border-r border-slate-200 bg-white transition lg:z-20 lg:flex lg:flex-col ${mobileOpen ? "flex flex-col" : "hidden lg:flex"}`}>
        <Link to="/" className="border-b border-slate-200 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Browser-only lab</div>
          <div className="flex items-center justify-between gap-2"><span className="text-xl font-bold">Mega Cryptography Suite</span><button className="icon-btn lg:hidden" onClick={(event) => { event.preventDefault(); setMobileOpen(false); }}><X /></button></div>
        </Link>
        <div className="p-4">
          <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms" />
          </label>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {grouped.map(({ category, items }) => {
            const Icon = icons[categoryIcon[category] ?? "Shield"];
            const isOpen = openCategories.has(category);
            const hasActive = items.some((item) => location.pathname === item.route);
            return (
              <section key={category} className="mb-2">
                <button
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold ${hasActive ? "bg-cyan-50 text-cyan-800" : "text-slate-700 hover:bg-slate-100"}`}
                  onClick={() => setOpenCategories((current) => {
                    const next = new Set(current);
                    next.has(category) ? next.delete(category) : next.add(category);
                    return next;
                  })}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{category}</span>
                  <ChevronDown className={`h-4 w-4 transition ${isOpen ? "" : "-rotate-90"}`} />
                </button>
                {isOpen && (
                  <div className="mt-1 space-y-1 pl-3">
                    {items.map((item) => (
                      <NavLink
                        key={item.route}
                        to={item.route}
                        className={({ isActive }) => `flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm ${isActive ? "bg-ink text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="flex shrink-0 items-center gap-1">
                          <ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact />
                          <SecurityStatusBadge status={item.securityStatus} compact />
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-80">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between"><div className="font-bold">Mega Cryptography Suite</div><button className="icon-btn" onClick={() => setMobileOpen(true)}><Menu /></button></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PrivacyBanner />
          <Breadcrumbs />
          <PageChrome />
          <Suspense fallback={<div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">Loading cryptography module...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
