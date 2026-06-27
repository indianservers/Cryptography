import { useMemo, useState } from "react";
import { Blowfish } from "egoroof-blowfish";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ByteGrid } from "../../../components/common/ByteGrid";
import { bytesToHex } from "../../../lib/legacyCiphers";
import { asciiToBytes } from "../../../lib/format";

const paddingNames = ["PKCS5", "ONE_AND_ZEROS", "LAST_BYTE", "NULL", "SPACES"] as const;
type PaddingName = typeof paddingNames[number];

function paddingValue(name: PaddingName) {
  return Blowfish.PADDING[name];
}

export default function BlowfishPage() {
  const [plain, setPlain] = useState("Blowfish demo block");
  const [key, setKey] = useState("correct horse battery");
  const [mode, setMode] = useState<"ECB" | "CBC">("CBC");
  const [padding, setPadding] = useState<PaddingName>("PKCS5");
  const [iv, setIv] = useState("bfish iv");
  const [activeRound, setActiveRound] = useState(1);
  const result = useMemo(() => {
    try {
      const cipher = new Blowfish(key, Blowfish.MODE[mode], paddingValue(padding));
      if (mode === "CBC") cipher.setIv(asciiToBytes(iv, 8));
      const encrypted = cipher.encode(plain);
      const decrypted = cipher.decode(encrypted, Blowfish.TYPE.STRING);
      return { ok: true as const, encrypted, encryptedHex: bytesToHex(encrypted), decrypted };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : "Blowfish operation failed." };
    }
  }, [iv, key, mode, padding, plain]);

  const blockBytes = result.ok ? Array.from(result.encrypted.slice(0, 8), (byte) => byte.toString(16).padStart(2, "0")) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Blowfish Workbench" category="Symmetric Cryptography" status="Legacy">Encrypt and decrypt with a real bundled Blowfish implementation running locally in the browser, then inspect 64-bit blocks and mode behavior.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Blowfish inputs">
          <div className="grid gap-4">
            <Field label="Plaintext"><textarea className="field min-h-24" value={plain} onChange={(event) => setPlain(event.target.value)} /></Field>
            <Field label="Variable-length key" value={key} hint="ASCII key text passed to the bundled Blowfish library."><input className="field" value={key} onChange={(event) => setKey(event.target.value)} /></Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Mode"><select className="field" value={mode} onChange={(event) => setMode(event.target.value as "ECB" | "CBC")}><option>ECB</option><option>CBC</option></select></Field>
              <Field label="Padding"><select className="field" value={padding} onChange={(event) => setPadding(event.target.value as PaddingName)}>{paddingNames.map((name) => <option key={name}>{name}</option>)}</select></Field>
            </div>
            <Field label="CBC IV ASCII, first 8 bytes used" value={iv} expectedBytes={8} hint="Converted internally to the 8-byte CBC IV."><input className="field font-mono" value={iv} onChange={(event) => setIv(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Real Blowfish output">
          {result.ok ? <div className="space-y-3"><ValueRow label="Ciphertext hex" value={result.encryptedHex} /><ValueRow label="Round-trip decrypt" value={result.decrypted} /><div><h3 className="mb-2 text-sm font-semibold">First encrypted 64-bit block</h3><ByteGrid bytes={blockBytes} changed={[0, 1, 2, 3, 4, 5, 6, 7]} /></div></div> : <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{result.error}</div>}
        </Card>
      </div>
      <Card title="Blowfish structure">
        <div className="grid gap-3 md:grid-cols-4">
          <ValueRow label="Block size" value="64 bits" />
          <ValueRow label="Feistel rounds" value="16" />
          <ValueRow label="Key setup" value="P-array and four S-boxes are key-dependent" />
          <ValueRow label="Mode shown" value={mode} />
        </div>
        <p className="mt-4 text-sm text-slate-700">Blowfish is a real Feistel block cipher. This page delegates the official P-array/S-box math to a browser-bundled library, while the UI exposes block size, padding, IV behavior, and round-trip verification.</p>
      </Card>
      <Card title="Round picture">
        <div className="grid gap-4 xl:grid-cols-[14rem_1fr]">
          <Field label={`Active round: ${activeRound}`}>
            <input type="range" min="1" max="16" value={activeRound} onChange={(event) => setActiveRound(Number(event.target.value))} className="w-full" />
          </Field>
          <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 16 }, (_, index) => {
              const round = index + 1;
              return (
                <div key={round} className={`rounded-md border p-3 text-center ${round === activeRound ? "changed-byte border-amber-300 bg-amber-100 text-amber-950" : "border-slate-200 bg-slate-50"}`}>
                  <div className="text-xs font-semibold uppercase">Round {round}</div>
                  <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-1 font-mono text-xs"><span>L</span><span>F</span><span>R</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-amber-900">Currently changing in round {activeRound}</div>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
              <div className="text-xs font-semibold uppercase text-slate-500">Left half</div>
              <div className="mt-1 font-mono font-bold">L{activeRound - 1}</div>
            </div>
            <div className="text-center font-bold text-slate-400">xor P{activeRound}</div>
            <div className="changed-byte rounded-md border border-amber-300 bg-white p-3 text-center">
              <div className="text-xs font-semibold uppercase text-amber-800">Active F input</div>
              <div className="mt-1 font-mono font-bold">F(L xor P)</div>
            </div>
            <div className="text-center font-bold text-slate-400">xor</div>
            <div className="rounded-md border border-slate-200 bg-white p-3 text-center">
              <div className="text-xs font-semibold uppercase text-slate-500">Right half</div>
              <div className="mt-1 font-mono font-bold">R{activeRound}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-amber-950">Only the active F input is highlighted here. The other boxes provide context so the round does not look like all 16 rounds are changing at once.</p>
        </div>
        <p className="mt-4 text-sm text-slate-700">Only the selected round is highlighted so the 16-round Feistel flow is easier to follow: one side enters F, the result mixes with the other side, then the halves swap.</p>
      </Card>
      <WarningBadge>Blowfish is legacy because 64-bit blocks collide too quickly for large data volumes. Use AES-GCM or ChaCha20-Poly1305 for new designs.</WarningBadge>
    </div>
  );
}
