import { useEffect, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const hex = (value: Uint8Array | ArrayBuffer) => Array.from(value instanceof Uint8Array ? value : new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
const xor = (a: Uint8Array, b: Uint8Array) => Uint8Array.from({ length: Math.min(a.length, b.length) }, (_, index) => a[index] ^ b[index]);
const block = async (key: string, state: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${key}:${state}`))).slice(0, 16);

export default function OFBModePage() {
  const [plain, setPlain] = useState("OFB produces a keystream from feedback blocks.");
  const [key, setKey] = useState("demo-key");
  const [iv, setIv] = useState("000102030405060708090a0b0c0d0e0f");
  const [rows, setRows] = useState<{ block: number; feedback: string; keystream: string; plaintext: string; ciphertext: string }[]>([]);
  useEffect(() => {
    let active = true;
    (async () => {
      const data = new TextEncoder().encode(plain);
      const nextRows = [];
      let feedback = iv;
      for (let offset = 0; offset < data.length || offset === 0; offset += 16) {
        const stream = await block(key, feedback);
        const chunk = data.slice(offset, offset + 16);
        const cipher = xor(chunk, stream);
        nextRows.push({ block: offset / 16, feedback, keystream: hex(stream), plaintext: hex(chunk), ciphertext: hex(cipher) });
        feedback = hex(stream);
      }
      if (active) setRows(nextRows);
    })();
    return () => { active = false; };
  }, [plain, key, iv]);

  return (
    <div className="space-y-6">
      <PageHeader title="OFB Mode" category="Modes of Operation" status="Legacy">Generate a keystream by repeatedly encrypting feedback state, then XOR it with plaintext.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="OFB inputs">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="Educational block key"><input className="field" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <Field label="IV / feedback start"><input className="field font-mono" value={iv} onChange={(event) => setIv(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Ciphertext"><ValueRow label="Ciphertext hex" value={rows.map((row) => row.ciphertext).join("") || "computing"} /></Card>
      </div>
      <Card title="Feedback loop">
        <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Block</th><th className="p-2 text-left">Feedback input</th><th className="p-2 text-left">Keystream</th><th className="p-2 text-left">Ciphertext</th></tr></thead><tbody>{rows.map((row) => <tr key={row.block} className="border-t border-slate-100"><td className="p-2 font-mono">{row.block}</td><td className="p-2 font-mono">{row.feedback}</td><td className="p-2 font-mono">{row.keystream}</td><td className="p-2 font-mono">{row.ciphertext}</td></tr>)}</tbody></table></div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>Browser Web Crypto does not expose AES-OFB. This page implements real OFB feedback mechanics using a local SHA-256 educational block function, so it is for mode learning only.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="OFB mode" data={{ plain, key, iv, rows }} /></div>
      </Card>
    </div>
  );
}
