import { useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

const cleanHex = (value: string) => value.replace(/[^0-9a-f]/gi, "");
const bytes = (value: string, size: number) => new Uint8Array(Array.from({ length: size }, (_, index) => parseInt(cleanHex(value).padEnd(size * 2, "0").slice(index * 2, index * 2 + 2), 16)));
const hex = (value: Uint8Array | ArrayBuffer) => Array.from(value instanceof Uint8Array ? value : new Uint8Array(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;

export default function GCMModePage() {
  const [plain, setPlain] = useState("authenticated browser message");
  const [aad, setAad] = useState("header:v1");
  const [keyHex, setKeyHex] = useState("00112233445566778899aabbccddeeff");
  const [nonceHex, setNonceHex] = useState("000102030405060708090a0b");
  const [cipher, setCipher] = useState("");
  const [tag, setTag] = useState("");
  const [message, setMessage] = useState("Ready to encrypt locally with AES-GCM.");
  const encrypt = async () => {
    try {
      const key = await crypto.subtle.importKey("raw", bytes(keyHex, 16), "AES-GCM", false, ["encrypt", "decrypt"]);
      const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: bytes(nonceHex, 12), additionalData: new TextEncoder().encode(aad), tagLength: 128 }, key, toArrayBuffer(new TextEncoder().encode(plain))));
      setCipher(hex(encrypted.slice(0, -16)));
      setTag(hex(encrypted.slice(-16)));
      setMessage("Encrypted with Web Crypto AES-GCM. The final 16 bytes are the authentication tag.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AES-GCM encryption failed.");
    }
  };
  const verify = async () => {
    try {
      const key = await crypto.subtle.importKey("raw", bytes(keyHex, 16), "AES-GCM", false, ["decrypt"]);
      const combined = new Uint8Array([...bytes(cipher, cipher.length / 2), ...bytes(tag, 16)]);
      const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(nonceHex, 12), additionalData: new TextEncoder().encode(aad), tagLength: 128 }, key, toArrayBuffer(combined));
      setMessage(`Tag verified and decrypted: ${new TextDecoder().decode(decrypted)}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "GCM tag verification failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="GCM Mode" category="Modes of Operation" status="Modern">AES-GCM combines CTR-style encryption with GHASH authentication over ciphertext and AAD.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="AES-GCM inputs">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-24" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="AAD"><input className="field" value={aad} onChange={(event) => setAad(event.target.value)} /></Field>
            <Field label="AES-128 key hex"><input className="field font-mono" value={keyHex} onChange={(event) => setKeyHex(event.target.value)} /></Field>
            <Field label="96-bit nonce hex"><input className="field font-mono" value={nonceHex} onChange={(event) => setNonceHex(event.target.value)} /></Field>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={encrypt}>Encrypt</button><button className="btn" onClick={verify}>Verify and decrypt</button></div>
          </div>
        </Card>
        <Card title="GCM output">
          <p className="mb-4 text-sm text-slate-600">{message}</p>
          <div className="grid gap-3"><ValueRow label="Ciphertext" value={cipher || "not encrypted yet"} /><ValueRow label="Authentication tag" value={tag || "not encrypted yet"} /></div>
        </Card>
      </div>
      <Card title="GCM internal flow">
        <div className="grid gap-3 md:grid-cols-3"><ValueRow label="CTR lane" value="AES_K(nonce || counter) XOR plaintext" /><ValueRow label="GHASH lane" value="AAD and ciphertext are authenticated" /><ValueRow label="Tag lane" value="Encrypted counter mask XOR GHASH" /></div>
      </Card>
      <Card title="Warnings and export">
        <WarningBadge>Nonce reuse in GCM is catastrophic: it can reveal plaintext relationships and damage tag security.</WarningBadge>
        <div className="mt-4"><ExportReportButton title="GCM mode" data={{ plain, aad, keyHex, nonceHex, cipher, tag }} /></div>
      </Card>
    </div>
  );
}
