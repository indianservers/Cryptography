import { Link, useLocation } from "react-router-dom";
import { Hash, KeyRound, Layers, LockKeyhole, ShieldCheck, Signature, Binary, Waves } from "lucide-react";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { navigationItems } from "../../data/navigation";

const topRoutes = [
  { route: "/algorithms/symmetric/aes", note: "Symmetric", icon: LockKeyhole },
  { route: "/algorithms/stream/chacha20", note: "Symmetric", icon: Waves },
  { route: "/algorithms/hash/sha-256-step", note: "Hashing", icon: Hash },
  { route: "/algorithms/hash/sha2", note: "Hashing", icon: Hash },
  { route: "/algorithms/asymmetric/rsa", note: "Asymmetric", icon: KeyRound },
  { route: "/algorithms/ecc/ecdsa", note: "ECC", icon: Signature },
  { route: "/algorithms/modes/gcm", note: "Mode", icon: ShieldCheck },
  { route: "/algorithms/mac/hmac", note: "MAC", icon: ShieldCheck },
  { route: "/algorithms/kdf/pbkdf2", note: "KDF", icon: Layers },
  { route: "/algorithms/encoding/base64", note: "Encoding", icon: Binary },
];

export function TopAlgorithmsMenu() {
  const location = useLocation();
  const items = topRoutes.map((top) => ({ ...top, item: navigationItems.find((nav) => nav.route === top.route) })).filter((entry) => entry.item);

  return (
    <section className="top-algorithms-menu mb-4 hidden overflow-hidden rounded-md border border-slate-200 bg-white p-2 shadow-sm xl:block sm:p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Top 10 Algorithms</h2>
        <span className="hidden text-xs text-slate-500 sm:inline">Curated quick access</span>
      </div>
      <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
        {items.map(({ route, note, icon: Icon, item }) => {
          const active = location.pathname === route;
          return (
            <Link key={route} to={route} className={`flex min-h-10 min-w-40 items-center gap-2 rounded-md border px-3 py-2 transition sm:min-w-48 sm:gap-3 ${active ? "border-cyan-300 bg-cyan-50 text-cyan-900" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-200 hover:bg-white"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{item?.label}</span>
                <span className="text-xs text-slate-500">{note}</span>
              </span>
              {item && <SecurityStatusBadge status={item.securityStatus} compact />}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
