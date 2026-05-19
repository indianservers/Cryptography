import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { findAlgorithm } from "../../data/algorithmMetadata";
import { navigationItems } from "../../data/navigation";
import { DisplayControls } from "./DisplayControls";
import { AlgorithmComparisonMode } from "./AlgorithmComparisonMode";

const recentKey = "mega-crypto-recent-routes";
const readRecentRoutes = () => JSON.parse(localStorage.getItem(recentKey) ?? "[]") as string[];

export function PageChrome() {
  const location = useLocation();
  const algorithm = findAlgorithm(location.pathname);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [recentRoutes, setRecentRoutes] = useState<string[]>(readRecentRoutes);

  useEffect(() => {
    document.title = algorithm ? `${algorithm.label} — Mega Crypto Suite` : "Home — Mega Crypto Suite";
    if (algorithm) {
      setRecentRoutes((current) => {
        const next = [algorithm.route, ...current.filter((route) => route !== algorithm.route)].slice(0, 8);
        localStorage.setItem(recentKey, JSON.stringify(next));
        window.dispatchEvent(new Event("recent-routes-change"));
        return next;
      });
    }
  }, [algorithm]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "?" && !event.ctrlKey && !event.metaKey) setShowShortcuts((current) => !current);
      if (event.key.toLowerCase() === "g" && event.altKey) setShowGlossary((current) => !current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const recent = recentRoutes.map((route) => navigationItems.find((item) => item.route === route)).filter(Boolean).slice(0, 5);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-2 text-sm shadow-sm sm:p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn hidden sm:inline-flex" onClick={() => document.body.classList.toggle("focus-mode")}>Focus mode</button>
          <button className="btn btn-primary" onClick={() => setShowComparison(true)}>Compare</button>
          <button className="btn hidden sm:inline-flex" onClick={() => setShowShortcuts(true)}>Shortcuts</button>
          <button className="btn hidden sm:inline-flex" onClick={() => setShowGlossary(true)}>Glossary</button>
          <DisplayControls />
        </div>
        <div className="hidden flex-wrap items-center gap-2 text-xs text-slate-600 md:flex">
          <span className="font-semibold text-slate-700">Recent:</span>
          {recent.length ? recent.map((item) => item && <Link key={item.route} className="rounded border border-slate-200 px-2 py-1 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900" to={item.route}>{item.label}</Link>) : <span>None yet</span>}
        </div>
      </div>
      {showComparison && <AlgorithmComparisonMode open={showComparison} onClose={() => setShowComparison(false)} />}
      {showShortcuts && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" onClick={() => setShowShortcuts(false)}><div className="max-w-lg rounded-md bg-white p-5 shadow-xl" onClick={(event) => event.stopPropagation()}><h2 className="text-lg font-semibold">Keyboard Shortcuts</h2><div className="mt-4 grid gap-2 text-sm"><div><kbd className="rounded bg-slate-100 px-2 py-1 font-mono">?</kbd> Toggle shortcuts</div><div><kbd className="rounded bg-slate-100 px-2 py-1 font-mono">Alt+G</kbd> Toggle glossary</div><div><kbd className="rounded bg-slate-100 px-2 py-1 font-mono">Esc</kbd> Close browser dialogs where supported</div></div><button className="btn btn-primary mt-5" onClick={() => setShowShortcuts(false)}>Close</button></div></div>}
      {showGlossary && <aside className="fixed inset-y-0 right-0 z-50 w-[min(100vw,28rem)] overflow-y-auto border-l border-slate-200 bg-white p-4 shadow-xl sm:p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">Crypto Glossary</h2><button className="icon-btn" aria-label="Close glossary" onClick={() => setShowGlossary(false)}><X /></button></div><div className="space-y-3 text-sm text-slate-700">{[
        ["Nonce", "A number used once. Reuse can break CTR, GCM, and stream ciphers."],
        ["IV", "Initialization vector. It starts a mode of operation and is often public but must follow mode rules."],
        ["Tag", "Authentication value proving ciphertext and AAD were not changed."],
        ["Salt", "Public random value used to make password derivation unique."],
        ["AAD", "Additional authenticated data: protected by a tag but not encrypted."],
      ].map(([term, text]) => <div key={term} className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="font-semibold">{term}</div><p className="mt-1">{text}</p></div>)}</div></aside>}
    </>
  );
}
