import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { bytesToText, hexToBytes, textToHexValue, xorBytes, xorHex } from "../../../lib/attacks";

const sampleP1 = "attack at dawn, send gold";
const sampleP2 = "defend at dusk, send food";
const sampleKey = "shared stream key bytes!!";

const encryptWithStream = (plaintext: string, stream: string) => {
  const plain = hexToBytes(textToHexValue(plaintext));
  const key = hexToBytes(textToHexValue(stream));
  return Array.from(xorBytes(plain, key), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export default function NonceReuseAttackPage() {
  const [cipher1, setCipher1] = useState(encryptWithStream(sampleP1, sampleKey));
  const [cipher2, setCipher2] = useState(encryptWithStream(sampleP2, sampleKey));
  const [knownPlaintext, setKnownPlaintext] = useState(sampleP1);
  const c1XorC2 = useMemo(() => xorHex(cipher1, cipher2), [cipher1, cipher2]);
  const knownHex = useMemo(() => textToHexValue(knownPlaintext), [knownPlaintext]);
  const recoveredOther = useMemo(() => bytesToText(xorBytes(hexToBytes(c1XorC2), hexToBytes(knownHex))), [c1XorC2, knownHex]);
  const recoveredStream = useMemo(() => xorHex(cipher1, knownHex), [cipher1, knownHex]);

  return (
    <div className="space-y-6">
      <PageHeader title="Nonce Reuse Attack Demo" category="Cryptanalysis and Attacks" status="Educational">
        Demonstrate the real XOR failure behind stream cipher nonce reuse: C1 XOR C2 equals P1 XOR P2. If one plaintext is known, the other is recovered for the overlapping bytes.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Inputs">
          <div className="grid gap-4">
            <Field label="Ciphertext 1 hex"><textarea className="field min-h-24 font-mono" value={cipher1} onChange={(event) => setCipher1(event.target.value)} /></Field>
            <Field label="Ciphertext 2 hex"><textarea className="field min-h-24 font-mono" value={cipher2} onChange={(event) => setCipher2(event.target.value)} /></Field>
            <Field label="Known plaintext for ciphertext 1"><input className="field font-mono" value={knownPlaintext} onChange={(event) => setKnownPlaintext(event.target.value)} /></Field>
            <button className="btn btn-primary w-fit" type="button" onClick={() => { setCipher1(encryptWithStream(sampleP1, sampleKey)); setCipher2(encryptWithStream(sampleP2, sampleKey)); setKnownPlaintext(sampleP1); }}>Load nonce-reuse sample</button>
          </div>
        </Card>

        <Card title="Recovered data">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="error">Same keystream assumption</StatusPill>
              <StatusPill tone="info">{Math.floor(c1XorC2.length / 2)} overlapping bytes</StatusPill>
            </div>
            <ValueRow label="C1 XOR C2 = P1 XOR P2" value={c1XorC2} />
            <ValueRow label="Recovered keystream prefix" value={recoveredStream} />
            <ValueRow label="Recovered plaintext 2 prefix" value={recoveredOther} />
            <WarningBadge>With CTR, OFB, RC4-style streams, or one-time pads, reusing the same keystream turns encryption into a two-time pad.</WarningBadge>
          </div>
        </Card>
      </div>
      <Card title="Why the leak happens">
        <p className="mb-3 text-sm text-slate-600">Reusing a nonce can repeat the same keystream, so XORing two ciphertexts cancels the keystream and exposes plaintext relationships.</p>
        <div className="grid gap-3 text-sm md:grid-cols-4">
          {["C1 = P1 xor K", "C2 = P2 xor K", "C1 xor C2", "P1 xor P2"].map((label, index) => <div key={label} className={`rounded-md border p-3 ${index >= 2 ? "border-rose-300 bg-rose-50 font-semibold text-rose-950" : "border-slate-200 bg-slate-50"}`}>{label}</div>)}
        </div>
      </Card>
    </div>
  );
}
