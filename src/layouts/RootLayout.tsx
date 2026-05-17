import { Suspense, useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Box, Braces, ChartBar, ChevronDown, Cpu, Database, FileKey, Fingerprint, Gauge, Hash, KeyRound, Layers, LockKeyhole, Menu, Network, Search, Shield, Shuffle, SquareCode, Waves, X, Zap } from "lucide-react";
import { navigationCategories, navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";
import { ImplementationBadge } from "../components/common/ImplementationBadge";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { PrivacyBanner } from "../components/common/PrivacyBanner";
import { PageChrome } from "../components/common/PageChrome";
import { TopAlgorithmsMenu } from "../components/common/TopAlgorithmsMenu";

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

const categoryDisplay: Record<string, string> = {
  "Classical Cryptography": "Classical",
  "Symmetric Cryptography": "Symmetric",
  "Block Ciphers": "Symmetric",
  "Stream Ciphers": "Stream",
  "Public Key Cryptography": "Asymmetric",
  "Elliptic Curve Cryptography": "ECC",
  "Hash Functions": "Hash",
  "MAC Algorithms": "MAC",
  "Key Derivation Functions": "KDF",
};

const categoryTone: Record<string, string> = {
  "Classical Cryptography": "border-sky-200 bg-sky-50 text-sky-800",
  "Symmetric Cryptography": "border-teal-200 bg-teal-50 text-teal-800",
  "Block Ciphers": "border-teal-200 bg-teal-50 text-teal-800",
  "Stream Ciphers": "border-cyan-200 bg-cyan-50 text-cyan-800",
  "Public Key Cryptography": "border-indigo-200 bg-indigo-50 text-indigo-800",
  "Elliptic Curve Cryptography": "border-violet-200 bg-violet-50 text-violet-800",
  "Hash Functions": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800",
  "MAC Algorithms": "border-rose-200 bg-rose-50 text-rose-800",
  "Key Derivation Functions": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Modes of Operation": "border-blue-200 bg-blue-50 text-blue-800",
  "Padding Schemes": "border-amber-200 bg-amber-50 text-amber-900",
  "Encoding Tools": "border-lime-200 bg-lime-50 text-lime-800",
  "Certificates and PKI": "border-slate-300 bg-slate-100 text-slate-800",
  "Cryptanalysis and Attacks": "border-red-200 bg-red-50 text-red-800",
  "Blockchain Cryptography": "border-orange-200 bg-orange-50 text-orange-800",
  "Randomness and Entropy": "border-purple-200 bg-purple-50 text-purple-800",
  "Benchmark and Comparison": "border-cyan-200 bg-cyan-50 text-cyan-800",
  "Saved Experiments": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Export Center": "border-blue-200 bg-blue-50 text-blue-800",
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
      items: navigationItems.filter((item) => {
        const display = categoryDisplay[item.category] ?? item.category;
        return item.category === category && (!normalized || item.label.toLowerCase().includes(normalized) || item.securityStatus.toLowerCase().includes(normalized) || display.toLowerCase().includes(normalized) || item.category.toLowerCase().includes(normalized));
      }),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-[#eef4f8] text-ink">
      <button
        className="icon-btn fixed left-3 top-3 z-30 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu />
      </button>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[1px] lg:hidden" onClick={closeMobileMenu} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,calc(100vw-2rem))] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 lg:z-20 lg:w-80 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none lg:pointer-events-auto"}`}
        aria-label="Primary navigation"
      >
        <Link to="/" className="border-b border-slate-200 px-4 py-4 lg:px-5" onClick={closeMobileMenu}>
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">Browser-only lab</div>
          <div className="flex items-center justify-between gap-2"><span className="text-lg font-bold leading-tight lg:text-xl">Mega Cryptography Suite</span><button className="icon-btn lg:hidden" aria-label="Close navigation menu" onClick={(event) => { event.preventDefault(); setMobileOpen(false); }}><X /></button></div>
        </Link>
        <div className="p-3 lg:p-4">
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms" />
          </label>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {grouped.map(({ category, items }) => {
            const Icon = icons[categoryIcon[category] ?? "Shield"];
            const hasActive = items.some((item) => location.pathname === item.route);
            const isOpen = openCategories.has(category) || hasActive || Boolean(query);
            const tone = categoryTone[category] ?? "border-slate-200 bg-slate-50 text-slate-800";
            return (
              <section key={category} className="mb-2">
                <button
                  className={`flex min-h-11 w-full items-center gap-2 rounded-md border px-2 py-2 text-left text-sm font-semibold transition ${hasActive ? tone : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"}`}
                  onClick={() => setOpenCategories((current) => {
                    const next = new Set(current);
                    next.has(category) ? next.delete(category) : next.add(category);
                    return next;
                  })}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{categoryDisplay[category] ?? category}</span>
                    {categoryDisplay[category] && <span className="block truncate text-[10px] font-medium text-slate-500">{category}</span>}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition ${isOpen ? "" : "-rotate-90"}`} />
                </button>
                {isOpen && (
                  <div className="mt-1 space-y-1 pl-3">
                    {items.map((item) => (
                      <NavLink
                        key={item.route}
                        to={item.route}
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `flex min-h-10 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition ${isActive ? "border-teal-700 bg-teal-700 text-white shadow-sm" : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"}`}
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
      <main className="min-h-screen lg:pl-80">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-2 pl-16 backdrop-blur lg:hidden">
          <div className="flex min-h-10 items-center justify-between gap-3"><div className="truncate text-sm font-bold">Mega Cryptography Suite</div><Link className="btn px-3" to="/">Home</Link></div>
        </div>
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <PrivacyBanner />
          <TopAlgorithmsMenu />
          <Breadcrumbs />
          <PageChrome />
          <Suspense fallback={<div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">Loading cryptography module...</div>}>
            <Outlet />
          </Suspense>
          <footer className="mt-10 border-t border-slate-200 py-6 text-sm text-slate-600">
            <div className="rounded-md border border-slate-200 bg-white px-4 py-5 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <a className="font-bold text-ink hover:text-teal-700" href="https://www.AimerSociety.com" target="_blank" rel="noreferrer">www.AimerSociety.com</a>
                  <div className="mt-1 font-semibold text-slate-700">AI Learning Tools</div>
                  <p className="mt-1 max-w-2xl">Artificial Intelligence Medical & Engineering Researchers Society Tools</p>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">All rights reserved.</div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
