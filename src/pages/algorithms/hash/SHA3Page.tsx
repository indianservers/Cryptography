import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { MatrixView } from "../../../components/common/MatrixView";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";
import { bytesToHex } from "../../../lib/hashCores";
import { textToBytes } from "../../../lib/format";

const rates: Record<string, { rateBytes: number; capacityBits: number; digestBits: number }> = {
  "SHA3-224": { rateBytes: 144, capacityBits: 448, digestBits: 224 },
  "SHA3-256": { rateBytes: 136, capacityBits: 512, digestBits: 256 },
  "SHA3-384": { rateBytes: 104, capacityBits: 768, digestBits: 384 },
  "SHA3-512": { rateBytes: 72, capacityBits: 1024, digestBits: 512 },
};

function keccakPad(message: string, rateBytes: number) {
  const bytes = Array.from(new TextEncoder().encode(message));
  const padded = [...bytes, 0x06];
  while (padded.length % rateBytes !== rateBytes - 1) padded.push(0);
  padded.push(0x80);
  return { bytes, padded, blocks: Array.from({ length: Math.ceil(padded.length / rateBytes) }, (_, index) => padded.slice(index * rateBytes, index * rateBytes + rateBytes)) };
}

async function spongeDigestPreview(message: string, variant: string, digestBits: number) {
  const seed = `${variant}:educational-sponge:${message}`;
  let block = bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", textToBytes(seed))));
  let output = "";
  for (let index = 0; output.length < digestBits / 4; index += 1) {
    block = bytesToHex(new Uint8Array(await crypto.subtle.digest("SHA-256", textToBytes(`${variant}:squeeze:${index}:${block}`))));
    output += block;
  }
  return output.slice(0, digestBits / 4);
}

export default function SHA3Page() {
  const [message, setMessage] = useState("abc");
  const [variant, setVariant] = useState("SHA3-256");
  const [digestPreview, setDigestPreview] = useState("computing...");
  const info = rates[variant];
  const padded = useMemo(() => keccakPad(message, info.rateBytes), [message, info.rateBytes]);
  const lanePreview = useMemo(() => {
    const state = Array.from({ length: 25 }, (_, index) => padded.blocks[0]?.slice(index * 8, index * 8 + 8) ?? []);
    return state.map((lane) => bytesToHex(lane).padEnd(16, "0"));
  }, [padded.blocks]);

  useEffect(() => {
    let active = true;
    spongeDigestPreview(message, variant, info.digestBits).then((digest) => {
      if (active) setDigestPreview(digest);
    });
    return () => { active = false; };
  }, [info.digestBits, message, variant]);

  return (
    <div className="space-y-6">
      <PageHeader title="SHA-3 Sponge Visualizer" category="Hash Functions" status="Modern">Visualize SHA-3 domain padding, rate/capacity split, absorb blocks, 5x5 lane layout, and a browser-local sponge-style digest preview.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card title="Message and variant">
          <div className="grid gap-4">
            <Field label="Message"><textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} /></Field>
            <Field label="Variant"><select className="field" value={variant} onChange={(event) => setVariant(event.target.value)}>{Object.keys(rates).map((name) => <option key={name}>{name}</option>)}</select></Field>
          </div>
        </Card>
        <Card title="Sponge parameters">
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Rate" value={`${info.rateBytes * 8} bits (${info.rateBytes} bytes)`} />
            <ValueRow label="Capacity" value={`${info.capacityBits} bits`} />
            <ValueRow label="Digest size" value={`${info.digestBits} bits`} />
            <ValueRow label="Absorb blocks" value={`${padded.blocks.length}`} />
            <ValueRow label="Digest preview" value={digestPreview} />
          </div>
        </Card>
      </div>
      <Card title="SHA-3 padding bytes">
        <p className="mb-3 text-sm text-slate-600">SHA-3 uses domain suffix 0x06 and a final 0x80 bit in the last byte of the rate block.</p>
        <MatrixView columns={8} values={padded.padded.slice(0, 64).map((byte) => byte.toString(16).padStart(2, "0"))} changed={[padded.bytes.length, padded.padded.length - 1].filter((index) => index < 64)} />
      </Card>
      <Card title="5x5 lane state preview before Keccak-f permutation">
        <MatrixView columns={5} values={lanePreview} changed={[0]} />
      </Card>
      <Card title="Absorb / permute / squeeze flow">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold">Absorb</h3><p className="mt-2 text-sm text-slate-600">XOR each rate-sized message block into the first rate portion of the 1600-bit state.</p></div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold">Keccak-f[1600]</h3><p className="mt-2 text-sm text-slate-600">Permutation rounds apply theta, rho, pi, chi, and iota to the 5x5 lanes.</p></div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4"><h3 className="font-semibold">Squeeze</h3><p className="mt-2 text-sm text-slate-600">Read digest bytes from the rate portion, permuting again if more output is needed.</p></div>
        </div>
      </Card>
      <Card title="Support warning and export">
        <WarningBadge>The digest preview is a deterministic educational browser-local sponge stand-in. Use a vetted Keccak implementation or WASM module for official SHA-3 test vectors.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="SHA-3 sponge" data={{ message, variant, info, padded, digestPreview }} /></div>
      </Card>
    </div>
  );
}
