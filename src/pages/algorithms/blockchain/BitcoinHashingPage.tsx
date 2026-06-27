import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex } from "../../../lib/cryptoDemos";

export default function BitcoinHashingPage() {
  const [previousHash, setPreviousHash] = useState("0000000000000000000abc");
  const [merkleRoot, setMerkleRoot] = useState("demo merkle root");
  const [nonce, setNonce] = useState("2083236893");
  const [firstHash, setFirstHash] = useState("");
  const [finalHash, setFinalHash] = useState("");
  const headerText = useMemo(() => `version=1|prev=${previousHash}|merkle=${merkleRoot}|time=demo|bits=demo|nonce=${nonce}`, [merkleRoot, nonce, previousHash]);

  useEffect(() => {
    digestHex("SHA-256", headerText).then((one) => {
      setFirstHash(one);
      return digestHex("SHA-256", one);
    }).then(setFinalHash).catch(() => setFinalHash("hash failed"));
  }, [headerText]);

  return (
    <div className="space-y-6">
      <PageHeader title="Bitcoin Hashing" category="Blockchain Cryptography" status="Educational">Bitcoin block headers are hashed twice with SHA-256; miners change the nonce to search for a hash below the target.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Header fields">
          <div className="grid gap-3">
            <Field label="Previous block hash"><input className="field font-mono" value={previousHash} onChange={(event) => setPreviousHash(event.target.value)} /></Field>
            <Field label="Merkle root"><input className="field font-mono" value={merkleRoot} onChange={(event) => setMerkleRoot(event.target.value)} /></Field>
            <Field label="Nonce"><input className="field font-mono" value={nonce} onChange={(event) => setNonce(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Hash output">
          <ValueRow label="Data being hashed" value={headerText} />
          <ValueRow label="First SHA-256" value={firstHash || "computing"} />
          <ValueRow label="Second SHA-256" value={finalHash || "computing"} />
        </Card>
      </div>
      <Card title="Block hashing diagram">
        <div className="grid gap-3 text-sm md:grid-cols-4">
          {["Header fields", "Serialize bytes", "SHA-256", "SHA-256 again"].map((label, index) => <div key={label} className={`rounded-md border p-3 ${index === 3 ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><p className="font-semibold">{label}</p><p className="mt-1 text-xs text-slate-600">{["version, previous hash, Merkle root, time, bits, nonce", "Bitcoin uses exact byte order rules", "first digest", "final block hash"][index]}</p></div>)}
        </div>
      </Card>
      <WarningBadge>This demo teaches the flow. Real Bitcoin validation also requires exact serialization, endian handling, compact target bits, and consensus rules.</WarningBadge>
    </div>
  );
}
