import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { NavigationItem, SecurityStatus } from "../../types";
import { navigationItems } from "../../data/navigation";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { BrowserSupportBadge, ImplementationBadge } from "./ImplementationBadge";

const securityScore: Record<SecurityStatus, number> = {
  Modern: 5,
  Legacy: 3,
  Educational: 2,
  Deprecated: 1,
  Unsafe: 0,
};

const speedByCategory: Record<string, string> = {
  "Classical Cryptography": "Very fast, educational only",
  "Symmetric Cryptography": "Fast for bulk data",
  "Block Ciphers": "Fast; hardware support varies",
  "Stream Ciphers": "Very fast stream processing",
  "Public Key Cryptography": "Slower; used for keys/signatures",
  "Elliptic Curve Cryptography": "Efficient public-key operations",
  "Hash Functions": "Fast one-way digesting",
  "MAC Algorithms": "Fast authentication tags",
  "Key Derivation Functions": "Intentionally slow or memory-hard",
  "Modes of Operation": "Depends on cipher and nonce rules",
  "Padding Schemes": "Lightweight encoding layer",
};

const keySizeByCategory: Record<string, string> = {
  "Classical Cryptography": "Tiny or symbolic keys",
  "Symmetric Cryptography": "Usually 128-256-bit keys",
  "Block Ciphers": "Usually 64-256-bit keys",
  "Stream Ciphers": "Usually 128-256-bit keys plus nonce",
  "Public Key Cryptography": "Large modulus or group parameters",
  "Elliptic Curve Cryptography": "Compact 255-521-bit curve keys",
  "Hash Functions": "No secret key unless keyed mode",
  "MAC Algorithms": "Secret authentication key",
  "Key Derivation Functions": "Password plus salt and cost",
  "Modes of Operation": "Uses cipher key plus IV/nonce",
  "Padding Schemes": "Uses parent algorithm key size",
};

const useCaseByCategory: Record<string, string> = {
  "Classical Cryptography": "Teaching substitution and transposition ideas",
  "Symmetric Cryptography": "Encrypting data with a shared key",
  "Block Ciphers": "Block encryption and educational internals",
  "Stream Ciphers": "Streaming encryption with nonce discipline",
  "Public Key Cryptography": "Encryption, signatures, and key exchange",
  "Elliptic Curve Cryptography": "Compact signatures and key agreement",
  "Hash Functions": "Digests, fingerprints, and integrity building blocks",
  "MAC Algorithms": "Message authentication and tamper detection",
  "Key Derivation Functions": "Password hashing or key expansion",
  "Modes of Operation": "Turning block ciphers into message encryption",
  "Padding Schemes": "Encoding messages into block or RSA formats",
};

function metricFor(item: NavigationItem, metric: "speed" | "keySize" | "useCase") {
  if (metric === "speed") return speedByCategory[item.category] ?? "Depends on parameters and implementation";
  if (metric === "keySize") return keySizeByCategory[item.category] ?? "Depends on selected parameters";
  return useCaseByCategory[item.category] ?? item.category;
}

function recommendation(left: NavigationItem, right: NavigationItem) {
  const delta = securityScore[left.securityStatus] - securityScore[right.securityStatus];
  if (delta > 0) return `${left.label} has the stronger security status in this suite.`;
  if (delta < 0) return `${right.label} has the stronger security status in this suite.`;
  if (left.browserSupport === "Web Crypto" && right.browserSupport !== "Web Crypto") return `${left.label} has better native browser support.`;
  if (right.browserSupport === "Web Crypto" && left.browserSupport !== "Web Crypto") return `${right.label} has better native browser support.`;
  return "Both options need protocol context; compare the use case and parameter rules.";
}

function CompareCell({ item }: { item: NavigationItem }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="font-semibold text-slate-800">{item.label}</div>
      <div className="mt-1 text-xs text-slate-500">{item.category}</div>
    </div>
  );
}

export function AlgorithmComparisonMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  const defaultLeft = navigationItems.find((item) => item.route === "/algorithms/symmetric/aes") ?? navigationItems[0];
  const defaultRight = navigationItems.find((item) => item.route === "/algorithms/asymmetric/rsa") ?? navigationItems[1] ?? defaultLeft;
  const [leftRoute, setLeftRoute] = useState(defaultLeft.route);
  const [rightRoute, setRightRoute] = useState(defaultRight.route);
  const left = useMemo(() => navigationItems.find((item) => item.route === leftRoute) ?? defaultLeft, [defaultLeft, leftRoute]);
  const right = useMemo(() => navigationItems.find((item) => item.route === rightRoute) ?? defaultRight, [defaultRight, rightRoute]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 p-4" onClick={onClose}>
      <section className="mx-auto flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-md bg-white shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h2 className="text-lg font-bold">Comparison Mode</h2>
            <p className="text-sm text-slate-600">Compare two algorithms by security, speed, key size, browser support, and use case.</p>
          </div>
          <button className="icon-btn" onClick={onClose} title="Close comparison"><X /></button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">Algorithm A<select className="field mt-1" value={leftRoute} onChange={(event) => setLeftRoute(event.target.value)}>{navigationItems.map((item) => <option key={item.route} value={item.route}>{item.label}</option>)}</select></label>
            <label className="text-sm font-semibold text-slate-700">Algorithm B<select className="field mt-1" value={rightRoute} onChange={(event) => setRightRoute(event.target.value)}>{navigationItems.map((item) => <option key={item.route} value={item.route}>{item.label}</option>)}</select></label>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[10rem_1fr_1fr]">
            <div className="hidden md:block" />
            <CompareCell item={left} />
            <CompareCell item={right} />

            <div className="font-semibold text-slate-700">Security</div>
            <div className="rounded-md border border-slate-200 p-3"><SecurityStatusBadge status={left.securityStatus} /></div>
            <div className="rounded-md border border-slate-200 p-3"><SecurityStatusBadge status={right.securityStatus} /></div>

            <div className="font-semibold text-slate-700">Speed</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(left, "speed")}</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(right, "speed")}</div>

            <div className="font-semibold text-slate-700">Key Size</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(left, "keySize")}</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(right, "keySize")}</div>

            <div className="font-semibold text-slate-700">Browser Support</div>
            <div className="rounded-md border border-slate-200 p-3"><BrowserSupportBadge support={left.browserSupport ?? "Educational Substitute"} /><div className="mt-2"><ImplementationBadge status={left.implementationStatus ?? "Substitute"} /></div></div>
            <div className="rounded-md border border-slate-200 p-3"><BrowserSupportBadge support={right.browserSupport ?? "Educational Substitute"} /><div className="mt-2"><ImplementationBadge status={right.implementationStatus ?? "Substitute"} /></div></div>

            <div className="font-semibold text-slate-700">Use Case</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(left, "useCase")}</div>
            <div className="rounded-md border border-slate-200 p-3 text-sm">{metricFor(right, "useCase")}</div>
          </div>

          <div className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm font-semibold text-cyan-900">
            {recommendation(left, right)}
          </div>
        </div>
      </section>
    </div>
  );
}
