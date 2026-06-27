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
import { ColorLegend } from "../../../../components/common/ColorLegend";
import { CopyAsMenu } from "../../../../components/common/CopyAsMenu";
import { ErrorSummary } from "../../../../components/common/ErrorSummary";
import { RoundTimeline } from "../../../../components/visualization/RoundTimeline";
import { AvalancheChart } from "../../../../components/visualization/AvalancheChart";
import { asciiToBytes, asciiToHex, randomAscii, textToBinary, textToHex, hexPairs } from "../../../../lib/format";
import { explainCryptoError, validateAesFields } from "../../../../lib/cryptoValidation";
import { buildAesSteps, hexByte, hexWord } from "./aesEducationalCore";
import { aesSBox } from "./aesTables";
import { vectorsFor } from "../../../../data/testVectors";

const hexToBytes = (value: string) => new Uint8Array(hexPairs(value).map((byte) => parseInt(byte, 16)));
const bytesToHex = (value: Uint8Array) => Array.from(value, (byte) => byte.toString(16).padStart(2, "0")).join("");
const toArrayBuffer = (value: Uint8Array) => value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
type AesKeyBits = 128 | 192 | 256;
const keyBitsFromSize = (value: string): AesKeyBits => value === "AES-256" ? 256 : value === "AES-192" ? 192 : 128;
const cleanUserHex = (value: string) => value.replace(/[^0-9a-f]/gi, "");
const sBoxRows = Array.from({ length: 16 }, (_, row) => Array.from({ length: 16 }, (_, col) => aesSBox[row * 16 + col]));

function applyBlockPadding(data: Uint8Array, padding: string) {
  const remainder = data.length % 16;
  if (padding === "No padding") {
    if (remainder !== 0) throw new Error("AES-CBC with no padding needs plaintext length to be a multiple of 16 bytes.");
    return data;
  }
  if (padding === "Zero padding") {
    if (remainder === 0) return data;
    const output = new Uint8Array(data.length + 16 - remainder);
    output.set(data);
    return output;
  }
  const padLength = remainder === 0 ? 16 : 16 - remainder;
  const output = new Uint8Array(data.length + padLength);
  output.set(data);
  output.fill(padLength, data.length);
  return output;
}

function removeBlockPadding(data: Uint8Array, padding: string) {
  if (padding === "No padding") return data;
  if (padding === "Zero padding") {
    let end = data.length;
    while (end > 0 && data[end - 1] === 0) end -= 1;
    return data.slice(0, end);
  }
  const padLength = data[data.length - 1];
  if (padLength < 1 || padLength > 16) throw new Error("Invalid PKCS#7 padding byte in decrypted block.");
  for (let index = data.length - padLength; index < data.length; index += 1) {
    if (data[index] !== padLength) throw new Error("Invalid PKCS#7 padding structure.");
  }
  return data.slice(0, data.length - padLength);
}

function SBoxLookupPanel({ byteMap }: { byteMap?: { index: number; before: number; after: number; row: number; col: number }[] }) {
  const selected = byteMap?.[0];
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold">S-box lookup</h3>
        <p className="mt-1 text-xs text-slate-600">For SubBytes, the high nibble selects the row and the low nibble selects the column. The highlighted byte below is the first byte transformed in this step.</p>
      </div>
      <div className="rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950">
        {selected ? <>Current lookup: byte {selected.index} uses row <span className="font-mono font-bold">{selected.row.toString(16)}</span>, column <span className="font-mono font-bold">{selected.col.toString(16)}</span>, so <span className="font-mono font-bold">{hexByte(selected.before)}</span> becomes <span className="font-mono font-bold">{hexByte(selected.after)}</span>.</> : "Move to a SubBytes step to see the selected S-box lookup."}
      </div>
      <div className="max-h-44 overflow-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[30rem] text-center font-mono text-[10px]">
          <thead className="bg-slate-100">
            <tr><th className="p-1 text-slate-500">x</th>{Array.from({ length: 16 }, (_, col) => <th key={col} className="p-1 text-slate-500">{col.toString(16)}</th>)}</tr>
          </thead>
          <tbody>
            {sBoxRows.map((rowValues, row) => (
              <tr key={row} className="border-t border-slate-100">
                <th className="bg-slate-50 p-1 text-slate-500">{row.toString(16)}</th>
                {rowValues.map((value, col) => {
                  const active = selected?.row === row && selected.col === col;
                  return <td key={`${row}-${col}`} className={`p-1 ${active ? "bg-cyan-200 font-bold text-cyan-950" : "text-slate-700"}`}>{hexByte(value)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {byteMap ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {byteMap.map((item) => (
            <div key={item.index} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs">
              <div className="font-semibold">byte {item.index}</div>
              <div className="font-mono">{hexByte(item.before)} {"->"} S[{item.row.toString(16)}][{item.col.toString(16)}] {"->"} {hexByte(item.after)}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AESPage() {
  const [plain, setPlain] = useState("Attack at dawn!!");
  const [key, setKey] = useState("Sixteen byte key");
  const [iv, setIv] = useState("aes iv block 123");
  const [mode, setMode] = useState("CBC");
  const [size, setSize] = useState("AES-128");
  const [padding, setPadding] = useState("PKCS#7");
  const [cipher, setCipher] = useState("");
  const [cipherInput, setCipherInput] = useState("");
  const [aad, setAad] = useState("suite:aes:gcm");
  const [tagLength, setTagLength] = useState(128);
  const [cryptoMessage, setCryptoMessage] = useState("Web Crypto output appears after encryption.");
  const [testVectorMessage, setTestVectorMessage] = useState("");
  const [seenNonces, setSeenNonces] = useState<string[]>(() => JSON.parse(localStorage.getItem("mega-crypto-aes-nonces") ?? "[]") as string[]);
  const keyBits = keyBitsFromSize(size);
  const requiredKeyBytes = keyBits / 8;
  const keyBytes = asciiToBytes(key);
  const keyHex = asciiToHex(key);
  const ivHex = asciiToHex(iv);
  const asciiKeyIssues = Array.from(key).some((char) => char.charCodeAt(0) > 0x7f)
    ? [{ field: "Key", message: "Use ASCII characters only for the AES key text.", severity: "error" as const }]
    : [];
  const aesIssues = [
    ...asciiKeyIssues,
    ...validateAesFields({ keyHex, keyBytes: requiredKeyBytes, ivHex, mode }),
  ];
  const hasBlockingValidation = aesIssues.some((issue) => issue.severity === "error");
  const keyIsValid = asciiKeyIssues.length === 0 && keyBytes.length === requiredKeyBytes;
  const keyValidationText = keyIsValid ? `${size} key accepted: ${requiredKeyBytes} ASCII bytes.` : `${size} requires exactly ${requiredKeyBytes} ASCII characters. Current key has ${keyBytes.length}.`;
  const ivByteLength = asciiToBytes(iv).length;
  const ivValidationText = mode === "GCM" ? `GCM expects a 96-bit nonce: 12 ASCII characters. Current value has ${ivByteLength}.` : mode === "CTR" ? `CTR expects a 128-bit counter block: 16 ASCII characters. Current value has ${ivByteLength}.` : `CBC expects a 128-bit IV: 16 ASCII characters. Current value has ${ivByteLength}.`;
  const ivIsValid = mode === "GCM" ? ivByteLength === 12 : ivByteLength === 16 || mode === "ECB";
  const nonceFingerprint = `${size}:${mode}:${keyHex}:${ivHex}`;
  const nonceWasSeen = ["GCM", "CTR"].includes(mode) && seenNonces.includes(nonceFingerprint);
  const inputHex = textToHex(plain).padEnd(32, "0").slice(0, 32);
  const matrix = hexPairs(inputHex).slice(0, 16);
  const aesTrace = useMemo(() => buildAesSteps(inputHex, keyHex, keyBits), [inputHex, keyHex, keyBits]);
  const roundKeys = useMemo(() => aesTrace.roundKeys[0].map(hexByte), [aesTrace.roundKeys]);
  const educationalCipher = useMemo(() => hexWord(aesTrace.ciphertext), [aesTrace.ciphertext]);
  const roundSummaries = useMemo(() => Array.from({ length: aesTrace.rounds + 1 }, (_, round) => {
    const roundSteps = aesTrace.steps.filter((step) => step.round === round);
    const stateStep = [...roundSteps].reverse().find((step) => step.operation === "AddRoundKey") ?? roundSteps[roundSteps.length - 1];
    return {
      round,
      key: aesTrace.roundKeys[round],
      state: stateStep.state,
      stateTitle: round === 0 ? "After initial AddRoundKey" : round === aesTrace.rounds ? "Final ciphertext" : `After round ${round} AddRoundKey`,
      operations: roundSteps.map((step) => ({ operation: step.operation, state: step.state, title: step.title, byteMap: step.byteMap })),
    };
  }), [aesTrace.roundKeys, aesTrace.rounds, aesTrace.steps]);
  const getCryptoAlgorithm = (ivBytes: Uint8Array) => {
    if (mode === "GCM") {
      if (ivBytes.length < 12) throw new Error("AES-GCM needs a 12-byte nonce, entered as 12 ASCII characters.");
      return { name: "AES-GCM", iv: ivBytes.slice(0, 12), additionalData: new TextEncoder().encode(aad), tagLength };
    }
    if (mode === "CTR") {
      if (ivBytes.length < 16) throw new Error("AES-CTR needs a 16-byte counter block, entered as 16 ASCII characters.");
      return { name: "AES-CTR", counter: ivBytes.slice(0, 16), length: 64 };
    }
    if (ivBytes.length < 16) throw new Error("AES-CBC needs a 16-byte IV, entered as 16 ASCII characters.");
    return { name: "AES-CBC", iv: ivBytes.slice(0, 16) };
  };
  const encryptWithWebCrypto = async () => {
    if (hasBlockingValidation) {
      setCryptoMessage("Fix the validation summary before running Web Crypto encryption.");
      setCipher("");
      return;
    }
    if (!["GCM", "CBC", "CTR"].includes(mode)) {
      setCryptoMessage(`${mode} is shown as an educational mode here; Web Crypto does not expose AES-${mode}.`);
      setCipher(educationalCipher);
      return;
    }
    try {
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-" + mode, false, ["encrypt"]);
      const rawData = new TextEncoder().encode(plain);
      const data = mode === "CBC" ? applyBlockPadding(rawData, padding) : rawData;
      const ivBytes = asciiToBytes(iv);
      const algorithm = getCryptoAlgorithm(ivBytes);
      const encrypted = await crypto.subtle.encrypt(algorithm, cryptoKey, toArrayBuffer(data));
      const hex = bytesToHex(new Uint8Array(encrypted));
      setCipher(hex);
      setCipherInput(hex);
      if (["GCM", "CTR"].includes(mode)) {
        const next = [nonceFingerprint, ...seenNonces.filter((item) => item !== nonceFingerprint)].slice(0, 100);
        setSeenNonces(next);
        localStorage.setItem("mega-crypto-aes-nonces", JSON.stringify(next));
      }
      setCryptoMessage(`Encrypted locally with Web Crypto ${size}-${mode}. The internal visualizer below traces the first 16-byte block.`);
    } catch (error) {
      setCryptoMessage(explainCryptoError(error));
      setCipher("");
    }
  };
  const decryptWithWebCrypto = async () => {
    if (hasBlockingValidation) {
      setCryptoMessage("Fix the validation summary before running Web Crypto decryption.");
      return;
    }
    const ciphertextHex = cleanUserHex(cipherInput || cipher);
    if (!ciphertextHex) {
      setCryptoMessage("Encrypt first, or paste ciphertext into the ciphertext input.");
      return;
    }
    if (!["GCM", "CBC", "CTR"].includes(mode)) {
      setCryptoMessage(`${mode} decrypt is educational-only here because Web Crypto does not expose AES-${mode}.`);
      return;
    }
    try {
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, "AES-" + mode, false, ["decrypt"]);
      const ivBytes = asciiToBytes(iv);
      const algorithm = getCryptoAlgorithm(ivBytes);
      const decrypted = new Uint8Array(await crypto.subtle.decrypt(algorithm, cryptoKey, toArrayBuffer(hexToBytes(ciphertextHex))));
      const unpadded = mode === "CBC" ? removeBlockPadding(decrypted, padding) : decrypted;
      setCryptoMessage(`Decrypted locally with Web Crypto ${size}-${mode}: ${new TextDecoder().decode(unpadded)}`);
    } catch (error) {
      setCryptoMessage(explainCryptoError(error));
    }
  };
  const loadNistAesVector = () => {
    setSize("AES-128");
    setMode("CBC");
    setPadding("No padding");
    setPlain("\u0000\u0011\"3DUfw\u0088\u0099\u00aa\u00bb\u00cc\u00dd\u00ee\u00ff");
    setKey("AES-128 demo key");
    setIv("nist iv block 00");
    setCipher("");
    setCipherInput("");
    setCryptoMessage("Loaded AES-128 educational vector values. The round visualizer uses the 00112233445566778899aabbccddeeff block.");
  };
  const verifyAesVector = async () => {
    const vector = vectorsFor("AES")[0];
    setSize("AES-128");
    setMode("CBC");
    setPadding("No padding");
    setKey("AES-128 demo key");
    setIv("nist iv block 00");
    const plaintextBytes = hexToBytes(String(vector.input.plaintextHex));
    try {
      const cryptoKey = await crypto.subtle.importKey("raw", hexToBytes(String(vector.input.key)), "AES-CBC", false, ["encrypt"]);
      const encrypted = await crypto.subtle.encrypt({ name: "AES-CBC", iv: hexToBytes(String(vector.input.iv)) }, cryptoKey, toArrayBuffer(plaintextBytes));
      const actual = bytesToHex(new Uint8Array(encrypted));
      const expected = vector.expected.ciphertextHex;
      setCipher(actual);
      setCipherInput(actual);
      setTestVectorMessage(actual === expected ? `PASS: ${vector.name}` : `FAIL: expected ${expected}, got ${actual}`);
    } catch (error) {
      setTestVectorMessage(explainCryptoError(error));
    }
  };
  const loadRecommended = () => {
    setSize("AES-256");
    setMode("GCM");
    setPadding("No padding");
    setPlain("Recommended example: AES-GCM with a unique 96-bit nonce and authenticated data.");
    setKey(randomAscii(32));
    setIv(randomAscii(12));
    setAad("course=mega-crypto-suite");
    setTagLength(128);
    setCipher("");
    setCipherInput("");
  };
  const loadUnsafe = () => {
    setSize("AES-128");
    setMode("ECB");
    setPadding("PKCS#7");
    setPlain("BLOCK-BLOCK-BLOCK-BLOCK-BLOCK-BLOCK");
    setKey("weak demo key 00");
    setIv("unsafe iv block!");
    setCryptoMessage("Unsafe example loaded: ECB is educational only and leaks repeated plaintext blocks.");
  };
  return (
    <div className="space-y-6">
      <PageHeader title="AES Workbench" category="Symmetric Cryptography" status="Modern">Explore AES block encryption, Web Crypto backed modes, and a custom educational round visualizer.</PageHeader>
      <section className="rounded-md border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
        <div className="font-semibold">AES study path</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/algorithms/symmetric/aes-128-step">Guided internal operations</Link>
          <Link className="btn" to="/algorithms/symmetric/aes-rounds">Round visualizer</Link>
          <Link className="btn" to="/algorithms/symmetric/aes-sbox">Compact S-box explorer</Link>
          <Link className="btn" to="/algorithms/symmetric/aes-key-expansion">Key expansion</Link>
        </div>
      </section>
      <ErrorSummary issues={aesIssues} />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <InputPanel title="AES inputs and settings">
          <div className="grid gap-4">
            <label className="label">Plaintext<textarea className="field mt-1 min-h-24" value={plain} onChange={(e) => setPlain(e.target.value)} /></label>
            <div className="grid gap-3 md:grid-cols-2"><label className="label">Key size<select className="field mt-1" value={size} onChange={(e) => setSize(e.target.value)}><option>AES-128</option><option>AES-192</option><option>AES-256</option></select></label><label className="label">Mode<select className="field mt-1" value={mode} onChange={(e) => setMode(e.target.value)}><option>ECB</option><option>CBC</option><option>CFB</option><option>OFB</option><option>CTR</option><option>GCM</option></select></label></div>
            <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">Key ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${keyIsValid ? "text-emerald-700" : "text-amber-700"}`}>{keyBytes.length}/{requiredKeyBytes} bytes</span></span><input className={`field mt-1 font-mono ${keyIsValid ? "border-emerald-300 bg-emerald-50 text-emerald-950 focus:ring-emerald-200" : "border-rose-300 bg-rose-50"}`} value={key} onChange={(e) => setKey(e.target.value)} /></label>
            <div className={`rounded-md border p-3 text-sm ${keyIsValid ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{keyValidationText}</div>
            <label className="label">Ciphertext hex for decrypt<input className="field mt-1 font-mono" value={cipherInput} onChange={(e) => setCipherInput(e.target.value)} placeholder="Encrypt output is copied here, or paste ciphertext" /></label>
            <label className="label"><span className="flex flex-wrap items-center justify-between gap-2">IV / nonce ASCII<span className={`rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold ${ivIsValid ? "text-emerald-700" : "text-amber-700"}`}>{ivByteLength}/{mode === "GCM" ? 12 : 16} bytes</span></span><input className={`field mt-1 font-mono ${ivIsValid ? "border-emerald-300 bg-emerald-50" : "border-rose-300 bg-rose-50"}`} value={iv} onChange={(e) => setIv(e.target.value)} /></label>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600"><span className="font-semibold">Internal key hex:</span> <span className="font-mono">{keyHex}</span><br /><span className="font-semibold">Internal IV hex:</span> <span className="font-mono">{ivHex}</span></div>
            <div className={`rounded-md border p-3 text-sm ${ivIsValid ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"}`}>{ivValidationText}</div>
            {nonceWasSeen && <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">Nonce reuse detector: this key/mode/nonce combination was already used in this browser session history.</div>}
            {mode === "GCM" && <div className="grid gap-3 md:grid-cols-2"><label className="label">AAD<input className="field mt-1" value={aad} onChange={(e) => setAad(e.target.value)} /></label><label className="label">GCM tag length<select className="field mt-1" value={tagLength} onChange={(e) => setTagLength(Number(e.target.value))}><option value={128}>128 bits</option><option value={120}>120 bits</option><option value={112}>112 bits</option><option value={104}>104 bits</option><option value={96}>96 bits</option><option value={64}>64 bits</option></select></label></div>}
            <label className="label">Padding<select className="field mt-1" value={padding} onChange={(e) => setPadding(e.target.value)}><option>PKCS#7</option><option>Zero padding</option><option>No padding</option></select></label>
            <div className="flex flex-wrap gap-2"><button className="btn" onClick={encryptWithWebCrypto}>Encrypt</button><button className="btn" onClick={decryptWithWebCrypto}>Decrypt</button><button className="btn" onClick={verifyAesVector}>Verify AES test vector</button><button className="btn" onClick={loadRecommended}>Recommended sample</button><button className="btn" onClick={loadUnsafe}>Unsafe sample</button><button className="btn" onClick={loadNistAesVector}>NIST-style vector</button><Link className="btn" to="/algorithms/symmetric/aes-128-step">Open internal operations</Link><button className="btn" onClick={() => setKey(randomAscii(keyBits / 8))}>Random {size} key</button><button className="btn" onClick={() => setIv(randomAscii(mode === "GCM" ? 12 : 16))}>Random IV</button></div>
            {testVectorMessage && <div className={`rounded-md border p-3 text-sm font-semibold ${testVectorMessage.startsWith("PASS") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{testVectorMessage}</div>}
          </div>
        </InputPanel>
        <OutputPanel title="AES output block">
          <div className="space-y-4"><p className="text-sm text-slate-600">{cryptoMessage}</p><HexViewer value={cipher || educationalCipher} /><CopyButton value={cipher || educationalCipher} /><CopyAsMenu value={cipher || educationalCipher} json={{ cipher: cipher || educationalCipher, mode, size, iv, ivHex, aad, tagLength }} /><DownloadButton filename="aes-output.txt" value={cipher || educationalCipher} /><ColorLegend /><div><h3 className="mb-2 font-semibold">Input as 4x4 state matrix</h3><MatrixView values={matrix} /></div><AvalancheChart changedBits={63} /></div>
        </OutputPanel>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Educational AES block visualizer</h2><RoundTimeline steps={["Input block", "Initial AddRoundKey", "SubBytes", "ShiftRows", "MixColumns", "AddRoundKey", "Final round without MixColumns", "Ciphertext"]} active={2} /><div className="mt-5 grid gap-5 xl:grid-cols-3"><div><h3 className="mb-2 font-semibold">Round 0 key matrix</h3><MatrixView values={roundKeys} changed={[0, 5, 10, 15]} /></div><div><h3 className="mb-2 font-semibold">Binary block</h3><pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{textToBinary(plain)}</pre></div><div><h3 className="mb-2 font-semibold">Key expansion notes</h3><p className="text-sm text-slate-600">{size} uses {aesTrace.rounds} encryption rounds and {aesTrace.rounds + 1} round keys. RotWord, SubWord, Rcon, and XOR derive the key schedule shown below.</p></div></div></section>

      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Round-by-round key and ciphertext states</h2>
            <p className="mt-1 text-sm text-slate-600">This {size} educational trace uses one 16-byte plaintext block and the exact selected key size. Each row shows the expanded round key and the state after that round's AddRoundKey. Round {aesTrace.rounds} is the final ciphertext.</p>
          </div>
          <Link className="btn" to="/algorithms/symmetric/aes-128-step">Open step-by-step byte view</Link>
        </div>
        <div className="space-y-4">
          {roundSummaries.map((summary) => (
            <details key={summary.round} className="rounded-md border border-slate-200 bg-slate-50 p-4" open={summary.round <= 2 || summary.round === aesTrace.rounds}>
              <summary className="cursor-pointer list-none">
                <div className="grid gap-3 lg:grid-cols-[7rem_1fr_1fr]">
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">Round</div>
                    <div className="text-xl font-bold">{summary.round}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">Key in round {summary.round}</div>
                    <div className="break-all font-mono text-sm">{hexWord(summary.key)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase text-slate-500">{summary.stateTitle}</div>
                    <div className="break-all font-mono text-sm">{hexWord(summary.state)}</div>
                  </div>
                </div>
              </summary>
              <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_0.8fr_1.2fr]">
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Round key matrix K{summary.round}</h3>
                  <MatrixView values={summary.key.map(hexByte)} />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Ciphertext/state matrix</h3>
                  <MatrixView values={summary.state.map(hexByte)} />
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Operations inside round {summary.round}</h3>
                  <div className="max-h-72 overflow-auto rounded-md border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">Operation</th><th className="p-2 text-left">State hex</th></tr></thead>
                      <tbody>
                        {summary.operations.map((operation, index) => <tr key={`${summary.round}-${operation.title}-${index}`} className="border-t border-slate-100"><td className="p-2 font-mono">{index + 1}</td><td className="p-2">{operation.operation}</td><td className="break-all p-2 font-mono text-xs">{hexWord(operation.state)}</td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {summary.operations.some((operation) => operation.operation === "SubBytes") ? (
                <div className="mt-4 rounded-md border border-cyan-100 bg-cyan-50 p-4">
                  <SBoxLookupPanel byteMap={summary.operations.find((operation) => operation.operation === "SubBytes")?.byteMap} />
                </div>
              ) : null}
            </details>
          ))}
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2"><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Learning notes</h2><p className="mt-2 text-sm text-slate-600">AES works on a 4x4 byte state. SubBytes provides nonlinear substitution from the real AES S-box, ShiftRows moves bytes across columns, MixColumns diffuses each column, and AddRoundKey injects the round key. AES-128 has 10 rounds, AES-192 has 12, and AES-256 has 14.</p></div><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Mistakes and export</h2><WarningBadge>ECB leaks repeated blocks. GCM and CTR require nonce uniqueness under a key. Web Crypto requires exact raw key length for the selected AES size.</WarningBadge><div className="mt-4"><ExportReportButton title="AES" data={{ plain, key, keyHex, iv, ivHex, mode, size, padding, aad, tagLength, educationalCipher, cipher, cipherInput }} /></div></div></section>
    </div>
  );
}
