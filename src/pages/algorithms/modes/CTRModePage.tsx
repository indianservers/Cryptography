import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const cleanHex = (value: string) => value.replace(/[^0-9a-f]/gi, "");
const bytes = (value: string, size: number) => new Uint8Array(Array.from({ length: size }, (_, index) => parseInt(cleanHex(value).padEnd(size * 2, "0").slice(index * 2, index * 2 + 2), 16)));
const hex = (value: Uint8Array | ArrayBuffer) => Array.from(value instanceof Uint8Array ? value : new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;

export default function CTRModePage() {
  const [plain, setPlain] = useState("CTR turns block encryption into a seekable stream.");
  const [keyHex, setKeyHex] = useState("00112233445566778899aabbccddeeff");
  const [counterHex, setCounterHex] = useState("000102030405060708090a0b0c0d0e0f");
  const [cipher, setCipher] = useState("");
  const [message, setMessage] = useState("Ready to encrypt locally with AES-CTR.");
  const blocks = useMemo(() => {
    const data = Array.from(new TextEncoder().encode(plain));
    return Array.from({ length: Math.ceil(data.length / 16) || 1 }, (_, block) => ({ block, counter: `${counterHex.slice(0, 24)}${(parseInt(counterHex.slice(24) || "0", 16) + block).toString(16).padStart(8, "0").slice(-8)}`, plaintext: data.slice(block * 16, block * 16 + 16).map((byte) => byte.toString(16).padStart(2, "0")).join("") }));
  }, [plain, counterHex]);
  const encrypt = async () => {
    try {
      const key = await crypto.subtle.importKey("raw", bytes(keyHex, 16), "AES-CTR", false, ["encrypt"]);
      const data = new TextEncoder().encode(plain);
      const encrypted = await crypto.subtle.encrypt({ name: "AES-CTR", counter: bytes(counterHex, 16), length: 64 }, key, toArrayBuffer(data));
      setCipher(hex(encrypted));
      setMessage("Encrypted with Web Crypto AES-CTR. CTR produces ciphertext by XORing plaintext with encrypted counter blocks.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AES-CTR encryption failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="CTR Mode" category="Modes of Operation" status="Modern">Encrypt nonce-counter blocks to create a parallel keystream, then XOR that stream with plaintext.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="AES-CTR inputs">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-28" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="AES-128 key hex"><input className="field font-mono" value={keyHex} onChange={(event) => setKeyHex(event.target.value)} /></Field>
            <Field label="16-byte counter block hex"><input className="field font-mono" value={counterHex} onChange={(event) => setCounterHex(event.target.value)} /></Field>
            <button className="btn" onClick={encrypt}>Encrypt with AES-CTR</button>
          </div>
        </Card>
        <Card title="Ciphertext">
          <p className="mb-4 text-sm text-slate-600">{message}</p>
          <ValueRow label="Ciphertext hex" value={cipher || "not encrypted yet"} />
        </Card>
      </div>
      <Card title="Nonce + counter block flow">
        <div className="overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Block</th><th className="p-2 text-left">Counter block</th><th className="p-2 text-left">Plaintext bytes</th></tr></thead><tbody>{blocks.map((block) => <tr key={block.block} className="border-t border-slate-100"><td className="p-2 font-mono">{block.block}</td><td className="p-2 font-mono">{block.counter}</td><td className="p-2 font-mono">{block.plaintext}</td></tr>)}</tbody></table>
        </div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>Never reuse the same AES-CTR key and counter/nonce range. Reuse repeats keystream and exposes XOR relationships between plaintexts.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="CTR mode" data={{ plain, keyHex, counterHex, cipher, blocks }} /></div>
      </Card>
    </div>
  );
}
