export function PrivacyBanner() {
  return (
    <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      Browser-only privacy: cryptographic computation runs locally with Web Crypto or TypeScript visualizers. Saved experiments stay in LocalStorage or IndexedDB unless you export them.
    </div>
  );
}
