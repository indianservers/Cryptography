import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { desSBoxOutput } from "./desEducationalCore";
import { asciiToHex } from "../../../../lib/format";

const expand32To48 = (bits: string) => bits.padEnd(48, bits).slice(0, 48);

export default function DESPage() {
  const [block, setBlock] = useState("DESblock");
  const [key, setKey] = useState("DES key!");
  const values = useMemo(() => {
    const blockHex = asciiToHex(block, 8);
    const keyHex = asciiToHex(key, 8);
    const binary = BigInt("0x" + blockHex).toString(2).padStart(64, "0");
    const left = binary.slice(0, 32);
    const right = binary.slice(32);
    const expanded = expand32To48(right);
    const roundKey = BigInt("0x" + keyHex).toString(2).padStart(64, "0").slice(0, 48);
    const xored = expanded.split("").map((bit, index) => bit === roundKey[index] ? "0" : "1").join("");
    const sbox = Array.from({ length: 8 }, (_, index) => desSBoxOutput(index, xored.slice(index * 6, index * 6 + 6))).join("");
    return { binary, left, right, expanded, roundKey, xored, sbox };
  }, [block, key]);

  return (
    <div className="space-y-6">
      <PageHeader title="DES Workbench" category="Symmetric Cryptography" status="Deprecated">A real DES-structure visualizer for the 64-bit block split, 48-bit expansion, round-key XOR, and S-box compression. DES is deprecated.</PageHeader>
      <Card title="Overall DES flow">
        <div className="grid gap-2 md:grid-cols-5">
          {["Initial permutation", "16 Feistel rounds", "L/R swap", "Final permutation", "Ciphertext"].map((step, index) => (
            <div key={step} className={`rounded-md border p-3 text-center text-sm ${index === 1 ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
              <div className="font-mono text-xs">#{index + 1}</div>
              <div className="font-semibold">{step}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/algorithms/symmetric/des-full-step">Open guided 16-round walkthrough</Link>
          <Link className="btn" to="/algorithms/symmetric/des-key-schedule">Key schedule</Link>
          <Link className="btn" to="/algorithms/symmetric/des-sbox">S-box explorer</Link>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="64-bit block and key">
          <div className="grid gap-4">
            <Field label="64-bit block ASCII" value={block} expectedBytes={8} hint="Converted internally to the DES 64-bit block."><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
            <Field label="64-bit key ASCII including parity bytes" value={key} expectedBytes={8} hint="Converted internally to the DES key bytes."><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="First Feistel round state">
          <div className="space-y-3">
            <ValueRow label="L0" value={values.left} />
            <ValueRow label="R0" value={values.right} />
            <ValueRow label="S-box output 32 bits" value={values.sbox} />
          </div>
        </Card>
      </div>
      <Card title="Feistel f function">
        <div className="grid gap-3 xl:grid-cols-3">
          <ValueRow label="Expansion E(R0) to 48 bits" value={values.expanded} />
          <ValueRow label="XOR with round key" value={values.xored} />
          <ValueRow label="S1-S8 compression" value={values.sbox} />
        </div>
      </Card>
      <WarningBadge>DES has a 56-bit effective key after parity bits are removed. Exhaustive search is practical, so use AES instead.</WarningBadge>
    </div>
  );
}
