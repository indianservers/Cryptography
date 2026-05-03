import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { chachaBlock, textBlocks, xorHex } from "../../../lib/cryptoDemos";

export default function ChaCha20Page() {
  const [key, setKey] = useState("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f");
  const [nonce, setNonce] = useState("000000090000004a00000000");
  const [counter, setCounter] = useState(1);
  const [plain, setPlain] = useState("Ladies and Gentlemen of the class of 99");
  const block = useMemo(() => chachaBlock(key, nonce, counter), [counter, key, nonce]);
  const plainHex = textBlocks(plain, 64)[0];
  const cipher = xorHex(plainHex, block.keystream.slice(0, plainHex.length));
  const activeState = block.snapshots[Math.min(2, block.snapshots.length - 1)].state.map((word) => word.toString(16).padStart(8, "0"));

  return (
    <div className="space-y-6">
      <PageHeader title="ChaCha20" category="Stream Ciphers" status="Modern">A custom TypeScript ChaCha20 block function with the 4x4 state, quarter-round snapshots, keystream block, and XOR ciphertext.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Key, nonce, counter, plaintext">
          <div className="grid gap-3">
            <Field label="256-bit key hex"><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <Field label="96-bit nonce hex"><input className="field font-mono" value={nonce} onChange={(event) => setNonce(event.target.value)} /></Field>
            <Field label="Counter"><input className="field" type="number" value={counter} onChange={(event) => setCounter(Number(event.target.value))} /></Field>
            <Field label="Plaintext"><textarea className="field min-h-24" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="Keystream block hex" value={block.keystream} />
            <ValueRow label="Ciphertext hex" value={cipher} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="4x4 state matrix"><MatrixView values={activeState} /></Card>
        <Card title="Round snapshots"><div className="space-y-2">{block.snapshots.slice(0, 8).map((snapshot) => <div key={snapshot.name} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-sm font-semibold">{snapshot.name}</div>)}</div></Card>
      </div>
      <Card title="Quarter round operations">
        <div className="grid gap-3 md:grid-cols-4">{["a += b; d ^= a; d <<<= 16", "c += d; b ^= c; b <<<= 12", "a += b; d ^= a; d <<<= 8", "c += d; b ^= c; b <<<= 7"].map((step) => <div key={step} className="rounded-md bg-slate-50 p-3 font-mono text-xs">{step}</div>)}</div>
      </Card>
      <WarningBadge>ChaCha20 is a stream cipher. Reusing the same key and nonce repeats the keystream and compromises confidentiality.</WarningBadge>
    </div>
  );
}
