import { Component, Suspense, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUp, BookOpen, Box, Braces, Calculator, ChartBar, ChevronDown, Cpu, Database, FileKey, Fingerprint, Gauge, Hash, KeyRound, Layers, LockKeyhole, Menu, Network, Search, Shield, Shuffle, SquareCode, Waves, X, Zap } from "lucide-react";
import { navigationCategories, navigationItems, navigationSections } from "../data/navigation";
import { findAlgorithm } from "../data/algorithmMetadata";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";
import { ImplementationBadge } from "../components/common/ImplementationBadge";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { PrivacyBanner } from "../components/common/PrivacyBanner";
import { PageChrome } from "../components/common/PageChrome";
import { TopAlgorithmsMenu } from "../components/common/TopAlgorithmsMenu";

const icons = { Shield, BookOpen, LockKeyhole, Waves, KeyRound, Fingerprint, Hash, FileKey, Database, Network, ChartBar, Zap, Box, Layers, SquareCode, Braces, Shuffle, Gauge, Cpu, Calculator };

const categoryIcon: Record<string, keyof typeof icons> = {
  "Input/Output Demos": "Cpu",
  "Applied Mathematics": "Calculator",
  "Classical Cryptography": "BookOpen",
  "Symmetric Cryptography": "LockKeyhole",
  "Block Ciphers": "Box",
  "Stream Ciphers": "Waves",
  "Public Key Cryptography": "KeyRound",
  "Elliptic Curve Cryptography": "Fingerprint",
  "Hash Functions": "Hash",
  "MAC Algorithms": "FileKey",
  "Key Derivation Functions": "Database",
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
  "Input/Output Demos": "I/O Demos",
  "Applied Mathematics": "Math",
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
  "Input/Output Demos": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Applied Mathematics": "border-blue-200 bg-blue-50 text-blue-800",
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

const recentKey = "mega-crypto-recent-routes";
const readRecentRoutes = () => JSON.parse(localStorage.getItem(recentKey) ?? "[]") as string[];
const readDisplayModes = () => ({
  compact: localStorage.getItem("display-compact") === "true",
  darkTables: localStorage.getItem("display-dark-tables") === "true",
});
const isEditableTarget = (target: EventTarget | null) => target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target instanceof HTMLElement && target.isContentEditable;
const highlightMatch = (label: string, query: string) => {
  const normalized = query.trim();
  if (!normalized) return label;
  const index = label.toLowerCase().indexOf(normalized.toLowerCase());
  if (index === -1) return label;
  return (
    <>
      {label.slice(0, index)}
      <mark className="rounded bg-yellow-100 px-0.5 text-inherit">{label.slice(index, index + normalized.length)}</mark>
      {label.slice(index + normalized.length)}
    </>
  );
};

const implementationLabel = (status?: string) => status === "Real" ? "Implemented" : status === "Substitute" ? "Placeholder" : status ?? "Placeholder";

class PageErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Algorithm page crashed", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-md border border-rose-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Something went wrong</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">This cryptography module crashed.</h1>
          <p className="mt-2 max-w-2xl text-slate-600">Try returning home, then reopen the module. Your browser may not support one of the APIs this page attempted to use.</p>
          <Link className="btn btn-primary mt-5" to="/">Return home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recentRoutes, setRecentRoutes] = useState<string[]>(readRecentRoutes);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [displayModes, setDisplayModes] = useState(readDisplayModes);
  const [shortcutLabel] = useState(() => navigator.platform.toLowerCase().includes("mac") ? "⌘K" : "Ctrl+K");
  const searchRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  const currentItem = useMemo(() => navigationItems.find((item) => item.route === location.pathname), [location.pathname]);
  const currentAlgorithm = useMemo(() => findAlgorithm(location.pathname), [location.pathname]);
  const learnNext = useMemo(() => {
    if (!currentAlgorithm) return [];
    return navigationItems
      .filter((item) => item.route !== currentAlgorithm.route && (item.category === currentAlgorithm.category || item.securityStatus === currentAlgorithm.securityStatus))
      .slice(0, 4);
  }, [currentAlgorithm]);
  const pageTitle = currentItem?.label ?? "Home";
  const totalResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return navigationItems.length;
    return navigationItems.filter((item) => {
      const display = categoryDisplay[item.category] ?? item.category;
      return item.label.toLowerCase().includes(normalized) || item.securityStatus.toLowerCase().includes(normalized) || implementationLabel(item.implementationStatus).toLowerCase().includes(normalized) || display.toLowerCase().includes(normalized) || item.category.toLowerCase().includes(normalized);
    }).length;
  }, [query]);
  const recentItems = useMemo(() => recentRoutes.map((route) => navigationItems.find((item) => item.route === route)).filter(Boolean).slice(0, 5), [recentRoutes]);

  const grouped = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return navigationCategories.map((category) => ({
      category,
      items: navigationItems.filter((item) => {
        const display = categoryDisplay[item.category] ?? item.category;
        return item.category === category && (!normalized || item.label.toLowerCase().includes(normalized) || item.securityStatus.toLowerCase().includes(normalized) || implementationLabel(item.implementationStatus).toLowerCase().includes(normalized) || display.toLowerCase().includes(normalized) || item.category.toLowerCase().includes(normalized));
      }),
    })).filter((group) => group.items.length > 0);
  }, [query]);
  const groupedByCategory = useMemo(() => new Map(grouped.map((group) => [group.category, group])), [grouped]);
  const sectionedGroups = useMemo(() => navigationSections.map((section) => ({
    label: section.label,
    groups: section.categories.map((category) => groupedByCategory.get(category)).filter((group): group is { category: string; items: typeof navigationItems } => Boolean(group)),
  })).filter((section) => section.groups.length > 0), [groupedByCategory]);

  useEffect(() => {
    const syncRecentRoutes = () => setRecentRoutes(readRecentRoutes().slice(0, 5));
    syncRecentRoutes();
    window.addEventListener("recent-routes-change", syncRecentRoutes);
    return () => window.removeEventListener("recent-routes-change", syncRecentRoutes);
  }, [location.pathname]);

  useEffect(() => {
    const syncDisplayModes = () => setDisplayModes(readDisplayModes());
    syncDisplayModes();
    window.addEventListener("display-settings-change", syncDisplayModes);
    return () => window.removeEventListener("display-settings-change", syncDisplayModes);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      activeItemRef.current?.scrollIntoView({ block: "center" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (event.key === "/" && !isEditableTarget(event.target)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("focusSearch") === "1") {
      searchRef.current?.focus();
    }
  }, [location.search]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const clearSearch = () => {
    setQuery("");
    searchRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#eef4f8] text-ink">
      <button
        className="icon-btn fixed left-3 top-3 z-30 bg-white/90 backdrop-blur lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <Menu />
      </button>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[1px] lg:hidden" onClick={closeMobileMenu} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,calc(100vw-2rem))] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 lg:z-20 lg:w-80 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none lg:pointer-events-auto"}`}
        aria-label="Primary navigation"
      >
        <Link to="/" className="border-b border-slate-200 px-4 py-4 lg:px-5" onClick={closeMobileMenu}>
          <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">Browser-only lab</div>
          <div className="flex items-center justify-between gap-2"><span className="text-lg font-bold leading-tight lg:text-xl">Mega Cryptography Suite</span><button className="icon-btn lg:hidden" aria-label="Close navigation menu" onClick={(event) => { event.preventDefault(); setMobileOpen(false); }}><X /></button></div>
        </Link>
        <div className="space-y-2 p-3 lg:p-4">
          <div className="flex items-center gap-2">
            <label className="flex min-h-11 flex-1 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <span className="sr-only">Search algorithms</span>
              <Search className="h-4 w-4 text-slate-500" />
              <input ref={searchRef} aria-label="Search algorithms" className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms" />
              {query && <button type="button" className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" onClick={clearSearch} aria-label="Clear search"><X className="h-4 w-4" /></button>}
            </label>
            <button type="button" className="hidden rounded-md border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900 sm:block" onClick={() => setOpenCategories(new Set())}>Collapse all</button>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span>{query ? `${totalResults} result${totalResults === 1 ? "" : "s"}` : `${navigationItems.length} algorithms`}</span>
            <span className="font-mono">{shortcutLabel}</span>
          </div>
          {recentItems.length > 0 && (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Recent</div>
              <div className="flex flex-wrap gap-1">
                {recentItems.map((item) => item && <Link key={item.route} to={item.route} onClick={closeMobileMenu} className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900">{item.label}</Link>)}
              </div>
            </div>
          )}
        </div>
        <div className="relative min-h-0 flex-1">
        <nav className="h-full overflow-y-auto px-3 pb-6">
          {query && totalResults === 0 && (
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-800">No results for "{query}"</div>
              <button type="button" className="btn mt-3 min-h-9 px-3 py-1.5 text-xs" onClick={clearSearch}>Clear search</button>
            </div>
          )}
          {sectionedGroups.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="mb-2 flex items-center justify-between gap-2 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                <span>{section.label}</span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5">{section.groups.reduce((sum, group) => sum + group.items.length, 0)}</span>
              </div>
              {section.groups.map(({ category, items }) => {
                const Icon = icons[categoryIcon[category] ?? "Shield"];
                const hasActive = items.some((item) => location.pathname === item.route);
                const isOpen = openCategories.has(category) || hasActive || Boolean(query);
                const tone = categoryTone[category] ?? "border-slate-200 bg-slate-50 text-slate-800";
                const categoryCount = navigationItems.filter((item) => item.category === category).length;
                return (
                  <section key={category} className={`mb-2 ${isOpen ? "border-b border-slate-100 pb-2" : ""}`}>
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
                      <span className="rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">{query ? items.length : categoryCount}</span>
                      <ChevronDown className={`h-4 w-4 transition ${isOpen ? "" : "-rotate-90"}`} />
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-150 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0 overflow-hidden">
                        <div className="mt-1 space-y-1 pl-3">
                        {items.map((item) => {
                          const categoryLabel = categoryDisplay[item.category] ?? item.category;
                          return (
                          <NavLink
                            key={item.route}
                            to={item.route}
                            onClick={closeMobileMenu}
                            ref={(node) => {
                              if (location.pathname === item.route) activeItemRef.current = node;
                            }}
                            className={({ isActive }) => `flex min-h-10 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition ${isActive ? "border-teal-700 bg-teal-700 text-white shadow-sm" : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"}`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{highlightMatch(item.label, query)}</span>
                              {query && <span className="block truncate text-[10px] font-medium opacity-80">{highlightMatch(`${categoryLabel} / ${item.securityStatus} / ${implementationLabel(item.implementationStatus)}`, query)}</span>}
                            </span>
                            <span className="flex shrink-0 items-center gap-1">
                              <ImplementationBadge status={item.implementationStatus ?? "Substitute"} compact />
                              <SecurityStatusBadge status={item.securityStatus} compact />
                            </span>
                          </NavLink>
                        );
                        })}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-white/0" />
        </div>
      </aside>
      <main className="min-h-screen lg:pl-80">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-2 pl-16 backdrop-blur lg:hidden">
          <div className="flex min-h-10 items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{pageTitle}</div>
              {(displayModes.compact || displayModes.darkTables) && <div className="mt-0.5 flex gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{displayModes.compact && <span className="rounded-full bg-teal-50 px-1.5 py-0.5 text-teal-700">Compact</span>}{displayModes.darkTables && <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-white">Dark tables</span>}</div>}
            </div>
            <Link className="btn px-3" to="/">Home</Link>
          </div>
        </div>
        <div className="mx-auto max-w-[96rem] px-3 pb-4 pt-14 sm:px-6 sm:py-6 lg:px-8">
          <PrivacyBanner />
          <TopAlgorithmsMenu />
          <Breadcrumbs />
          <PageChrome />
          <PageErrorBoundary key={location.pathname}>
            <Suspense fallback={<div className="animate-pulse space-y-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="Loading cryptography module"><div className="h-5 w-36 rounded bg-slate-200" /><div className="h-8 w-3/4 max-w-xl rounded bg-slate-200" /><div className="grid gap-3 md:grid-cols-3"><div className="h-24 rounded bg-slate-100" /><div className="h-24 rounded bg-slate-100" /><div className="h-24 rounded bg-slate-100" /></div><div className="h-48 rounded bg-slate-100" /></div>}>
              <Outlet />
            </Suspense>
          </PageErrorBoundary>
          {currentAlgorithm && (
            <section className="mt-8 rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-950 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-teal-800">Page-end summary</div>
              <p className="mt-2">
                {currentAlgorithm.label} starts with {currentAlgorithm.inputs[0]?.toLowerCase() ?? "input"},
                shows {currentAlgorithm.visualizers[0]?.toLowerCase() ?? "the main transformation"},
                and ends with {currentAlgorithm.outputs[0]?.toLowerCase() ?? "a result"}.
              </p>
              {currentAlgorithm.notes[0] && <p className="mt-2 font-medium">{currentAlgorithm.notes[0]}</p>}
            </section>
          )}
          {learnNext.length > 0 && (
            <section className="mt-4 rounded-md border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wide text-slate-600">What to Learn Next</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {learnNext.map((item) => (
                  <Link key={item.route} to={item.route} className="rounded-md border border-slate-200 bg-slate-50 p-3 transition hover:border-teal-300 hover:bg-teal-50">
                    <div className="font-semibold text-slate-900">{item.label}</div>
                    <div className="mt-1 text-xs text-slate-600">{categoryDisplay[item.category] ?? item.category}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <footer className="mt-10 border-t border-slate-200 py-4 text-xs text-slate-500">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <a className="font-semibold text-slate-600 hover:text-teal-700" href="https://www.AimerSociety.com" target="_blank" rel="noreferrer">www.AimerSociety.com</a>
                <span className="mx-2 text-slate-300">/</span>
                <span>AI Learning Tools</span>
              </div>
              <div className="font-semibold uppercase tracking-wide">All rights reserved.</div>
            </div>
          </footer>
        </div>
      </main>
      {showBackToTop && (
        <button
          type="button"
          className="icon-btn fixed bottom-4 right-4 z-30 bg-white/95 backdrop-blur"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp />
        </button>
      )}
    </div>
  );
}
