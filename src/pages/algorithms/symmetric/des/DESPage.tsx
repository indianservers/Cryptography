import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { desSBoxOutput } from "./desEducationalCore";

const expand32To48 = (bits: string) => bits.padEnd(48, bits).slice(0, 48);

export default function DESPage() {
  const [block, setBlock] = useState("0123456789abcdef");
  const [key, setKey] = useState("133457799bbcdff1");
  const values = useMemo(() => {
    const binary = BigInt("0x" + block.replace(/[^0-9a-f]/gi, "").padEnd(16, "0").slice(0, 16)).toString(2).padStart(64, "0");
    const left = binary.slice(0, 32);
    const right = binary.slice(32);
    const expanded = expand32To48(right);
    const roundKey = BigInt("0x" + key.replace(/[^0-9a-f]/gi, "").padEnd(16, "0").slice(0, 16)).toString(2).padStart(64, "0").slice(0, 48);
    const xored = expanded.split("").map((bit, index) => bit === roundKey[index] ? "0" : "1").join("");
    const sbox = Array.from({ length: 8 }, (_, index) => desSBoxOutput(index, xored.slice(index * 6, index * 6 + 6))).join("");
    return { binary, left, right, expanded, roundKey, xored, sbox };
  }, [block, key]);

  return (
    <div className="space-y-6">
      <PageHeader title="DES Workbench" category="Symmetric Cryptography" status="Deprecated">A real DES-structure visualizer for the 64-bit block split, 48-bit expansion, round-key XOR, and S-box compression. DES is deprecated.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="64-bit block and key">
          <div className="grid gap-4">
            <Field label="64-bit block hex"><input className="field font-mono" value={block} onChange={(event) => setBlock(event.target.value)} /></Field>
            <Field label="64-bit key hex including parity bits"><input className="field font-mono" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
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
