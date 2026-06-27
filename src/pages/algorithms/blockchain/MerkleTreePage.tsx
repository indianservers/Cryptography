import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { digestHex } from "../../../lib/cryptoDemos";

const short = (value: string) => value ? `${value.slice(0, 10)}...${value.slice(-6)}` : "computing";

export default function MerkleTreePage() {
  const [text, setText] = useState("tx1: Alice pays Bob\ntx2: Bob pays Chen\ntx3: Chen pays Devi\ntx4: Devi pays Esha");
  const [activeLeaf, setActiveLeaf] = useState(0);
  const leaves = useMemo(() => text.split(/\n+/).filter(Boolean), [text]);
  const [leafHashes, setLeafHashes] = useState<string[]>([]);
  const [parents, setParents] = useState<string[]>([]);
  const [root, setRoot] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function build() {
      const hashedLeaves = await Promise.all(leaves.map((leaf) => digestHex("SHA-256", leaf)));
      const level1: string[] = [];
      for (let index = 0; index < hashedLeaves.length; index += 2) {
        const right = hashedLeaves[index + 1] ?? hashedLeaves[index];
        level1.push(await digestHex("SHA-256", `${hashedLeaves[index]}${right}`));
      }
      let current = level1;
      while (current.length > 1) {
        const next: string[] = [];
        for (let index = 0; index < current.length; index += 2) {
          next.push(await digestHex("SHA-256", `${current[index]}${current[index + 1] ?? current[index]}`));
        }
        current = next;
      }
      if (!cancelled) {
        setLeafHashes(hashedLeaves);
        setParents(level1);
        setRoot(current[0] ?? "");
      }
    }
    build();
    return () => { cancelled = true; };
  }, [leaves]);

  const selected = Math.min(activeLeaf, Math.max(leaves.length - 1, 0));
  const parentIndex = Math.floor(selected / 2);

  return (
    <div className="space-y-6">
      <PageHeader title="Merkle Tree" category="Blockchain Cryptography" status="Educational">Merkle trees hash leaves, combine neighboring hashes, and repeat until one root commits to every transaction.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Transactions">
          <Field label="One transaction per line"><textarea className="field min-h-36" value={text} onChange={(event) => { setText(event.target.value); setActiveLeaf(0); }} /></Field>
          <label className="mt-3 block text-sm font-medium text-slate-700">Highlighted leaf: {selected}<input className="ml-3 w-48 align-middle" type="range" min="0" max={Math.max(leaves.length - 1, 0)} value={selected} onChange={(event) => setActiveLeaf(Number(event.target.value))} /></label>
        </Card>
        <Card title="Root">
          <ValueRow label="Merkle root" value={root || "computing"} />
          <ValueRow label="Selected leaf hash" value={leafHashes[selected] || "computing"} />
          <ValueRow label="Selected parent hash" value={parents[parentIndex] || "computing"} />
        </Card>
      </div>
      <Card title="Animated combine path">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">{leaves.map((leaf, index) => <div key={`${leaf}-${index}`} className={`rounded-md border p-2 text-xs ${index === selected ? "border-cyan-300 bg-cyan-50 font-semibold" : "border-slate-200 bg-slate-50"}`}>Leaf {index}: {leaf}<br /><span className="font-mono">{short(leafHashes[index])}</span></div>)}</div>
          <div className="space-y-2">{parents.map((parent, index) => <div key={parent} className={`rounded-md border p-2 text-xs ${index === parentIndex ? "border-amber-300 bg-amber-50 font-semibold" : "border-slate-200 bg-slate-50"}`}>Pair {index * 2} + {index * 2 + 1}<br /><span className="font-mono">{short(parent)}</span></div>)}</div>
          <div className="rounded-md border-2 border-emerald-300 bg-emerald-50 p-3 text-xs font-semibold">Root<br /><span className="font-mono">{short(root)}</span></div>
        </div>
        <p className="mt-3 text-sm text-slate-600">The highlighted path shows the hashes needed to prove one transaction is included without rereading every transaction.</p>
      </Card>
      <WarningBadge>Changing one leaf changes its parent path and finally the root, which is why Merkle roots summarize many transactions compactly.</WarningBadge>
    </div>
  );
}
