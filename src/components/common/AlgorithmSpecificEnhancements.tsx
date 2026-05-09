import { useMemo, useState } from "react";
import type { SecurityStatus } from "../../types";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { ByteLevelFlowDiagram } from "../visualization/ByteLevelFlowDiagram";

type Family = "rsa" | "aes" | "des" | "fish" | "stream" | "dh" | "ecc" | "hash" | "mac" | "kdf" | "generic";

interface EnhancementProps {
  title: string;
  category: string;
  status: SecurityStatus;
}

const families = {
  rsa: /rsa/i,
  aes: /\baes\b/i,
  des: /\bdes\b|triple des|3des/i,
  fish: /blowfish|twofish/i,
  stream: /rc4|chacha20/i,
  dh: /elgamal|diffie/i,
  ecc: /\becc\b|ecdsa|ecdh|x25519|ed25519|curve/i,
  hash: /md5|sha-?1\b|sha-?2|sha-?256|sha-?3|keccak/i,
  mac: /hmac|cmac|gmac|poly1305/i,
  kdf: /pbkdf2|bcrypt|scrypt|argon2|hkdf/i,
};

const classify = (title: string): Family => {
  const match = Object.entries(families).find(([, pattern]) => pattern.test(title));
  return (match?.[0] as Family | undefined) ?? "generic";
};

const byteHex = (seed: string, count: number) => Array.from({ length: count }, (_, index) => ((seed.charCodeAt(index % Math.max(seed.length, 1)) + index * 31) & 255).toString(16).padStart(2, "0"));
const bitEstimate = (value: string) => Math.min(100, Math.round(new Set(value).size * 7 + value.length * 2));

function WorkbenchCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">{title}</h3>{children}</div>;
}

function MiniTimeline({ steps, active }: { steps: string[]; active: number }) {
  return <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">{steps.map((step, index) => <div key={step} className={`rounded-md border p-3 text-sm font-semibold ${index === active ? "border-cyan-300 bg-cyan-50 text-cyan-900 changed-byte" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{index + 1}. {step}</div>)}</div>;
}

function ByteStrip({ bytes, active = 0 }: { bytes: string[]; active?: number }) {
  return <div className="flex flex-wrap gap-1 font-mono text-xs">{bytes.map((byte, index) => <span key={`${byte}-${index}`} className={`rounded px-2 py-1 ${index === active ? "bg-cyan-600 text-white changed-byte" : "bg-slate-100 text-slate-700"}`}>{byte}</span>)}</div>;
}

function FlowRows({ rows }: { rows: [string, string][] }) {
  return <div className="overflow-auto rounded-md border border-slate-200"><table className="w-full min-w-[30rem] text-sm"><tbody>{rows.map(([left, right]) => <tr key={left} className="border-b border-slate-100 last:border-0"><td className="p-2 font-semibold text-slate-700">{left}</td><td className="p-2 font-mono text-slate-600 crypto-wrap">{right}</td></tr>)}</tbody></table></div>;
}

function RSAWorkbench({ step, message }: { step: number; message: string }) {
  const hash = byteHex(message, 8).join("");
  return <>
    <WorkbenchCard title="RSA panels"><MiniTimeline active={step % 5} steps={["Key generation", "Encrypt / decrypt", "Sign / verify", "OAEP encode", "PSS encode"]} /></WorkbenchCard>
    <WorkbenchCard title="Key, cipher, signature"><FlowRows rows={[["Key generation", "p=61, q=53, n=3233, e=17, d=2753"], ["Encryption", "m^e mod n -> ciphertext integer"], ["Decryption", "c^d mod n -> recovered message"], ["Signing", `SHA-256 preview ${hash} signed with private exponent`], ["Verification", "signature^e mod n equals message representative"]]} /></WorkbenchCard>
    <WorkbenchCard title="OAEP and PSS padding"><ByteStrip active={step % 8} bytes={["lHash", "PS", "01", "M", "seed", "MGF1", "DB", "EM"]} /><p className="mt-3 text-sm text-slate-600">OAEP protects encryption structure; PSS randomizes signatures with salt and MGF1.</p></WorkbenchCard>
  </>;
}

function AESWorkbench({ step, message }: { step: number; message: string }) {
  return <>
    <WorkbenchCard title="AES round visualizer"><MiniTimeline active={step % 5} steps={["SubBytes", "ShiftRows", "MixColumns", "AddRoundKey", "Final round"]} /></WorkbenchCard>
    <WorkbenchCard title="State and key expansion"><ByteStrip active={step % 16} bytes={byteHex(message, 16)} /><div className="mt-3 grid grid-cols-4 gap-2 text-center font-mono text-xs">{byteHex(`${message}:round`, 16).map((byte, index) => <span key={index} className="rounded bg-slate-100 p-2">{byte}</span>)}</div></WorkbenchCard>
    <WorkbenchCard title="Mode comparison"><FlowRows rows={[["ECB", "Fast but leaks repeated blocks"], ["CBC", "Needs unpredictable IV and padding"], ["CTR", "Turns AES into a stream; nonce must be unique"], ["GCM", "Authenticated encryption with unique nonce"]]} /></WorkbenchCard>
  </>;
}

function DESWorkbench({ step }: { step: number }) {
  return <>
    <WorkbenchCard title="Feistel animation"><MiniTimeline active={step % 4} steps={["Initial permutation", "Expand right half", "S-box substitution", "Swap halves"]} /></WorkbenchCard>
    <WorkbenchCard title="S-box and key schedule"><ByteStrip active={step % 8} bytes={["E", "K1", "S1", "S2", "S3", "S4", "P", "FP"]} /><p className="mt-3 text-sm text-slate-600">DES derives 16 round keys; Triple DES chains encrypt-decrypt-encrypt with independent keys.</p></WorkbenchCard>
    <WorkbenchCard title="DES vs 3DES"><FlowRows rows={[["DES", "56-bit effective key, deprecated"], ["Triple DES", "Three DES passes, legacy compatibility"], ["Modern replacement", "AES-GCM or ChaCha20-Poly1305"]]} /></WorkbenchCard>
  </>;
}

function FishWorkbench({ step }: { step: number }) {
  return <>
    <WorkbenchCard title="Key setup"><MiniTimeline active={step % 4} steps={["User key", "P-array/subkeys", "S-box material", "Round whitening"]} /></WorkbenchCard>
    <WorkbenchCard title="Feistel network"><ByteStrip active={step % 8} bytes={["L0", "R0", "F", "XOR", "Swap", "S-box", "MDS", "Out"]} /></WorkbenchCard>
    <WorkbenchCard title="AES finalist comparison"><FlowRows rows={[["Blowfish", "Fast 64-bit block cipher with expensive key setup"], ["Twofish", "AES finalist with key-dependent S-boxes"], ["AES", "Standardized and broadly hardware accelerated"]]} /></WorkbenchCard>
  </>;
}

function StreamWorkbench({ step, message, nonce, setNonce }: { step: number; message: string; nonce: string; setNonce: (value: string) => void }) {
  const stream = byteHex(`${message}:${nonce}`, 16);
  return <>
    <WorkbenchCard title="Stream timeline"><MiniTimeline active={step % 4} steps={["Initialize state", "Generate keystream", "XOR plaintext", "Advance counter"]} /></WorkbenchCard>
    <WorkbenchCard title="Keystream and XOR"><ByteStrip active={step % stream.length} bytes={stream} /><label className="mt-3 block text-sm font-semibold text-slate-700">Nonce / counter<input className="field mt-1" value={nonce} onChange={(event) => setNonce(event.target.value)} /></label></WorkbenchCard>
    <WorkbenchCard title="Bias and reuse warnings"><FlowRows rows={[["RC4", "Biased early keystream bytes; deprecated"], ["ChaCha20", "Use unique nonce and counter per key"], ["Reuse", "C1 XOR C2 reveals P1 XOR P2"]]} /></WorkbenchCard>
  </>;
}

function DHWorkbench({ step }: { step: number }) {
  return <>
    <WorkbenchCard title="Modular exponentiation"><MiniTimeline active={step % 4} steps={["Choose group", "Raise generator", "Exchange public values", "Derive shared secret"]} /></WorkbenchCard>
    <WorkbenchCard title="Step table"><FlowRows rows={[["Alice", "A = g^a mod p"], ["Bob", "B = g^b mod p"], ["Shared", "s = B^a mod p = A^b mod p"], ["ElGamal", "c1 = g^k, c2 = m * y^k"]]} /></WorkbenchCard>
    <WorkbenchCard title="MITM warning"><p className="text-sm text-amber-800">Unauthenticated exchange can be replaced by an attacker. Use signatures, certificates, or authenticated key exchange.</p></WorkbenchCard>
  </>;
}

function ECCWorkbench({ step }: { step: number }) {
  return <>
    <WorkbenchCard title="Curve point plotter"><div className="grid grid-cols-8 gap-1">{Array.from({ length: 64 }, (_, index) => <span key={index} className={`aspect-square rounded ${index % 9 === step % 9 ? "bg-cyan-500 changed-byte" : index % 5 === 0 ? "bg-slate-300" : "bg-slate-100"}`} />)}</div></WorkbenchCard>
    <WorkbenchCard title="Point operations"><MiniTimeline active={step % 4} steps={["Point add", "Point double", "Scalar multiply", "Verify relation"]} /></WorkbenchCard>
    <WorkbenchCard title="ECDSA nonce reuse"><FlowRows rows={[["Signature", "r, s = function(hash, private key, nonce k)"], ["Risk", "Repeating k can reveal the private key"], ["Mitigation", "Deterministic or high-quality nonce generation"]]} /></WorkbenchCard>
  </>;
}

function HashWorkbench({ step, message, setMessage }: { step: number; message: string; setMessage: (value: string) => void }) {
  const digestA = byteHex(message, 16);
  const digestB = byteHex(`${message}!`, 16);
  const changed = digestA.filter((byte, index) => byte !== digestB[index]).length;
  return <>
    <WorkbenchCard title="Padding and block splitting"><MiniTimeline active={step % 4} steps={["Message bytes", "Append 1 bit", "Length padding", "Compression blocks"]} /></WorkbenchCard>
    <WorkbenchCard title="Avalanche toggle"><label className="block text-sm font-semibold text-slate-700">Message<input className="field mt-1" value={message} onChange={(event) => setMessage(event.target.value)} /></label><div className="mt-3"><ByteStrip active={step % 16} bytes={digestA} /></div><p className="mt-3 text-sm text-slate-600">{changed}/16 digest bytes change when appending one character.</p></WorkbenchCard>
    <WorkbenchCard title="Hash warnings"><FlowRows rows={[["MD5", "Broken collision resistance"], ["SHA-1", "Deprecated for signatures and certificates"], ["SHA-2 / SHA-3", "Modern choices with different internal structures"]]} /></WorkbenchCard>
  </>;
}

function MACWorkbench({ step, message }: { step: number; message: string }) {
  return <>
    <WorkbenchCard title="Authentication flow"><MiniTimeline active={step % 4} steps={["Prepare key", "Process blocks", "Compute tag", "Verify tag"]} /></WorkbenchCard>
    <WorkbenchCard title="Tag verification"><ByteStrip active={step % 16} bytes={byteHex(`tag:${message}`, 16)} /><p className="mt-3 text-sm text-slate-600">Changing the message changes the tag; verification must compare expected and received tags safely.</p></WorkbenchCard>
    <WorkbenchCard title="Key reuse warnings"><FlowRows rows={[["HMAC", "Inner and outer hash with ipad/opad"], ["CMAC / GMAC", "Block-cipher authentication; respect IV rules"], ["Poly1305", "Never reuse the one-time key"]]} /></WorkbenchCard>
  </>;
}

function KDFWorkbench({ cost, setCost, salt, setSalt, message }: { cost: number; setCost: (value: number) => void; salt: string; setSalt: (value: string) => void; message: string }) {
  const strength = bitEstimate(message);
  const memory = Math.round((2 ** Math.min(cost, 18)) / 1024);
  return <>
    <WorkbenchCard title="Password strength and salt"><label className="block text-sm font-semibold text-slate-700">Salt<input className="field mt-1" value={salt} onChange={(event) => setSalt(event.target.value)} /></label><button className="btn mt-3" onClick={() => setSalt(byteHex(String(Date.now()), 12).join(""))}>Generate salt</button><div className="mt-3 h-3 overflow-hidden rounded bg-slate-100"><div className="h-full bg-cyan-500" style={{ width: `${strength}%` }} /></div><p className="mt-2 text-sm text-slate-600">Estimated password strength: {strength}/100</p></WorkbenchCard>
    <WorkbenchCard title="Cost controls"><label className="text-sm font-semibold text-slate-700">Cost / iterations<input type="range" min="4" max="18" value={cost} onChange={(event) => setCost(Number(event.target.value))} className="mt-2 w-full" /></label><FlowRows rows={[["Cost", String(cost)], ["Time estimate", `${Math.max(1, cost * cost)} ms educational estimate`], ["Memory estimate", `${memory} KiB educational estimate`]]} /></WorkbenchCard>
    <WorkbenchCard title="Derived-key comparison"><ByteStrip bytes={byteHex(`${message}:${salt}:${cost}`, 16)} /><div className="mt-3"><ByteStrip bytes={byteHex(`${message}:${salt}:${cost + 1}`, 16)} /></div></WorkbenchCard>
  </>;
}

export function AlgorithmSpecificEnhancements({ title, category, status }: EnhancementProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("local cryptography demo message");
  const [nonce, setNonce] = useState("0001020304050607");
  const [salt, setSalt] = useState("local-demo-salt");
  const [cost, setCost] = useState(10);
  const family = useMemo(() => classify(`${title} ${category}`), [category, title]);
  if (family === "generic") return null;

  return (
    <section className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Algorithm-specific interactive workbench</h2><SecurityStatusBadge status={status} compact /></div>
          <p className="mt-1 text-sm text-slate-600">Focused panels for this algorithm family.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => setStep((current) => current + 1)}>Next step</button>
          <button className="btn" onClick={() => setOpen((current) => !current)}>{open ? "Hide panels" : "Show panels"}</button>
        </div>
      </div>
      {open && (
        <>
          <div className="mt-4">
            <ByteLevelFlowDiagram input={message} output={byteHex(`${title}:${message}:${step}`, 24).join("")} operation={title} activeStep={step} />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            {family === "rsa" && <RSAWorkbench step={step} message={message} />}
            {family === "aes" && <AESWorkbench step={step} message={message} />}
            {family === "des" && <DESWorkbench step={step} />}
            {family === "fish" && <FishWorkbench step={step} />}
            {family === "stream" && <StreamWorkbench step={step} message={message} nonce={nonce} setNonce={setNonce} />}
            {family === "dh" && <DHWorkbench step={step} />}
            {family === "ecc" && <ECCWorkbench step={step} />}
            {family === "hash" && <HashWorkbench step={step} message={message} setMessage={setMessage} />}
            {family === "mac" && <MACWorkbench step={step} message={message} />}
            {family === "kdf" && <KDFWorkbench cost={cost} setCost={setCost} salt={salt} setSalt={setSalt} message={message} />}
          </div>
        </>
      )}
    </section>
  );
}
