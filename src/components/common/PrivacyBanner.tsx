import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const storageKey = "privacy-banner-dismissed";

export function PrivacyBanner() {
  const location = useLocation();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(storageKey) === "true");
  }, []);

  if (location.pathname === "/" || dismissed) return null;

  return (
    <div className="privacy-banner mb-4 flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      <p className="flex-1">Browser-only privacy: cryptographic computation runs locally with Web Crypto or TypeScript visualizers. Saved experiments stay in LocalStorage or IndexedDB unless you export them.</p>
      <button
        type="button"
        className="rounded p-1 text-emerald-700 transition hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        aria-label="Dismiss privacy notice"
        onClick={() => {
          localStorage.setItem(storageKey, "true");
          setDismissed(true);
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
