import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex } from "../../../lib/cryptoDemos";

export default function WalletKeyPairPage() {
  const [privateKey, setPrivateKey] = useState("demo private key - do not use");
  const [publicKey, setPublicKey] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    digestHex("SHA-256", `public:${privateKey}`).then((pub) => {
      setPublicKey(pub);
      return digestHex("SHA-256", `address:${pub}`);
    }).then((addr) => setAddress(addr.slice(0, 40))).catch(() => setAddress("hash failed"));
  }, [privateKey]);

  return (
    <div className="space-y-6">
      <PageHeader title="Wallet Key Pair" category="Blockchain Cryptography" status="Educational">A wallet private key creates a public key, and the public key is hashed or encoded into an address.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Demo private key text">
          <Field label="Demo private key text"><input className="field border-rose-200 bg-rose-50 font-mono" value={privateKey} onChange={(event) => setPrivateKey(event.target.value)} /></Field>
          <p className="mt-3 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">Never paste a real wallet private key into this or any unknown website.</p>
        </Card>
        <Card title="Derived relationship">
          <div className="grid gap-3">
            <ValueRow label="Public key concept" value={publicKey || "computing"} />
            <ValueRow label="Address concept" value={address || "computing"} />
          </div>
        </Card>
      </div>
      <Card title="Key relationship diagram">
        <div className="grid gap-3 text-sm md:grid-cols-4">
          {["Private key", "Elliptic-curve multiply", "Public key", "Address hash/encode"].map((label, index) => <div key={label} className={`rounded-md border p-3 ${index === 0 ? "border-rose-300 bg-rose-50" : index === 2 ? "border-cyan-300 bg-cyan-50" : index === 3 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><p className="font-semibold">{label}</p><p className="mt-1 text-xs text-slate-600">{["must stay secret", "one-way operation", "safe to share", "what people send funds to"][index]}</p></div>)}
        </div>
      </Card>
      <WarningBadge>This page is conceptual and does not generate real wallet keys. Use vetted wallet software for real funds.</WarningBadge>
    </div>
  );
}
