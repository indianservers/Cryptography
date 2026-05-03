import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../../components/common/PageHeader";
import { InputPanel } from "../../../../components/common/InputPanel";
import { OutputPanel } from "../../../../components/common/OutputPanel";
import { MatrixView } from "../../../../components/common/MatrixView";
import { HexViewer } from "../../../../components/common/HexViewer";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { CopyButton } from "../../../../components/common/CopyButton";
import { DownloadButton } from "../../../../components/common/DownloadButton";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { RoundTimeline } from "../../../../components/visualization/RoundTimeline";
import { AvalancheChart } from "../../../../components/visualization/AvalancheChart";
import { randomHex, textToBinary, textToHex, hexPairs } from "../../../../lib/format";

const hexToBytes = (value: string) => new Uint8Array(hexPairs(value).map((byte) => parseInt(byte, 16)));

export default function AESPage() {
  const [plain, setPlain] = useState("Attack at dawn!!");
  const [key, setKey] = useState("00112233445566778899aabbccddeeff");
  const [iv, setIv] = useState("000102030405060708090a0b0c0d0e0f");
  const [mode, setMode] = useState("CBC");
  const [size, setSize] = useState("AES-128");
  const [padding, setPadding] = useState("PKCS#7");
  const [cipher, setCipher] = useState("");
  const [cryptoMessage, setCryptoMessage] = useState("Web Crypto output appears after encryption.");
  const inputHex = textToHex(plain).padEnd(32, "0").slice(0, 32);
  const matrix = hexPairs(inputHex).slice(0, 16);
  const roundKeys = useMemo(() => hexPairs((key + randomHex(16)).slice(0, 64)).slice(0, 16), [key]);
  const pseudoCipher = useMemo(() => hexPairs(inputHex).map((b, index) => (parseInt(b, 16) ^ parseInt(roundKeys[index] ?? "00", 16)).toString(16).padStart(2, "0")).join(""), [inputHex, roundKeys]);
  const encryptWithWebCrypto = async () => {
    if (!["GCM", "CBC", "CTR"].includes(mode)) {
      setCryptoMessage(`${mode} is shown as an educational mode here; Web Crypto does not expose AES-${mode}.`);
      setCipher(pseudoCipher);
      return;
    }
    try {
      const keyBytes = hexToBytes(key).slice(0, size === "AES-256" ? 32 : size === "AES-192" ? 24 : 16);
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-" + mode, false, ["encrypt"]);
      const data = new TextEncoder().encode(plain);
      const ivBytes = hexToBytes(iv);
      const algorithm = mode === "GCM"
        ? { name: "AES-GCM", iv: ivBytes.slice(0, 12) }
        : mode === "CTR"
          ? { name: "AES-CTR", counter: ivBytes.slice(0, 16), length: 64 }
          : { name: "AES-CBC", iv: ivBytes.slice(0, 16) };
      const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, data);
      const hex = Array.from(new Uint8Array(encrypted), (byte) => byte.toString(16).padStart(2, "0")).join("");
      setCipher(hex);
      setCryptoMessage(`Encrypted locally with Web Crypto AES-${mode}.`);
    } catch (error) {
      setCryptoMessage(error instanceof Error ? error.message : "Web Crypto encryption failed.");
      setCipher(pseudoCipher);
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader title="AES Workbench" category="Symmetric Cryptography" status="Modern">Explore AES block encryption, Web Crypto backed modes, and a custom educational round visualizer.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <InputPanel title="AES inputs and settings">
          <div className="grid gap-4">
            <label className="label">Plaintext<textarea className="field mt-1 min-h-24" value={plain} onChange={(e) => setPlain(e.target.value)} /></label>
            <div className="grid gap-3 md:grid-cols-2"><label className="label">Key size<select className="field mt-1" value={size} onChange={(e) => setSize(e.target.value)}><option>AES-128</option><option>AES-192</option><option>AES-256</option></select></label><label className="label">Mode<select className="field mt-1" value={mode} onChange={(e) => setMode(e.target.value)}><option>ECB</option><option>CBC</option><option>CFB</option><option>OFB</option><option>CTR</option><option>GCM</option></select></label></div>
            <label className="label">Key hex<input className="field mt-1 font-mono" value={key} onChange={(e) => setKey(e.target.value)} /></label>
            <label className="label">IV / nonce hex<input className="field mt-1 font-mono" value={iv} onChange={(e) => setIv(e.target.value)} /></label>
            <label className="label">Padding<select className="field mt-1" value={padding} onChange={(e) => setPadding(e.target.value)}><option>PKCS#7</option><option>Zero padding</option><option>No padding</option></select></label>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={encryptWithWebCrypto}>Encrypt with Web Crypto where supported</button><Link className="btn" to="/algorithms/symmetric/aes-128-step">Open internal operations</Link><button className="btn">Decrypt</button><button className="btn" onClick={() => setKey(randomHex(size === "AES-256" ? 32 : size === "AES-192" ? 24 : 16))}>Random key</button><button className="btn" onClick={() => setIv(randomHex(16))}>Random IV</button></div>
          </div>
        </InputPanel>
        <OutputPanel title="AES output block">
          <div className="space-y-4"><p className="text-sm text-slate-600">{cryptoMessage}</p><HexViewer value={cipher || pseudoCipher} /><CopyButton value={cipher || pseudoCipher} /><DownloadButton filename="aes-output.txt" value={cipher || pseudoCipher} /><div><h3 className="mb-2 font-semibold">Input as 4x4 state matrix</h3><MatrixView values={matrix} /></div><AvalancheChart changedBits={63} /></div>
        </OutputPanel>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Educational AES block visualizer</h2><RoundTimeline steps={["Input block", "Initial AddRoundKey", "SubBytes", "ShiftRows", "MixColumns", "AddRoundKey", "Final round without MixColumns", "Ciphertext"]} active={2} /><div className="mt-5 grid gap-5 lg:grid-cols-3"><div><h3 className="mb-2 font-semibold">Round key matrix</h3><MatrixView values={roundKeys} changed={[0, 5, 10, 15]} /></div><div><h3 className="mb-2 font-semibold">Binary block</h3><pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{textToBinary(plain)}</pre></div><div><h3 className="mb-2 font-semibold">Key expansion notes</h3><p className="text-sm text-slate-600">RotWord, SubWord, Rcon, and XOR derive round keys. This page keeps the expanded state visible for learning; production systems must never expose it.</p></div></div></section>
      <section className="grid gap-6 xl:grid-cols-2"><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Learning notes</h2><p className="mt-2 text-sm text-slate-600">AES works on a 4x4 byte state. SubBytes provides nonlinear substitution, ShiftRows moves bytes across columns, MixColumns diffuses each column, and AddRoundKey injects secret material.</p></div><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Mistakes and export</h2><WarningBadge>ECB leaks repeated blocks. GCM and CTR require nonce uniqueness under a key.</WarningBadge><div className="mt-4"><ExportReportButton title="AES" data={{ plain, key, iv, mode, size, padding, pseudoCipher }} /></div></div></section>
    </div>
  );
}
