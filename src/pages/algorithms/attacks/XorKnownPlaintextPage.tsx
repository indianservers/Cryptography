import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { bytesToText, hexToBytes, textToHexValue, xorBytes, xorHex } from "../../../lib/attacks";

const knownPlain = "known header: amount=";
const secretPlain = "known header: amount=9000";
const otherPlain = "known header: amount=1250";
const stream = "stream bytes reused here!";

const encrypt = (plain: string) => Array.from(xorBytes(hexToBytes(textToHexValue(plain)), hexToBytes(textToHexValue(stream))), (byte) => byte.toString(16).padStart(2, "0")).join("");

export default function XorKnownPlaintextPage() {
  const [cipherKnown, setCipherKnown] = useState(encrypt(secretPlain));
  const [knownText, setKnownText] = useState(knownPlain);
  const [cipherTarget, setCipherTarget] = useState(encrypt(otherPlain));
  const knownHex = useMemo(() => textToHexValue(knownText), [knownText]);
  const keystreamPrefix = useMemo(() => xorHex(cipherKnown, knownHex), [cipherKnown, knownHex]);
  const recoveredTarget = useMemo(() => bytesToText(xorBytes(hexToBytes(cipherTarget), hexToBytes(keystreamPrefix))), [cipherTarget, keystreamPrefix]);

  return (
    <div className="space-y-6">
      <PageHeader title="XOR Known-Plaintext Attack" category="Cryptanalysis and Attacks" status="Educational">
        Recover a reused XOR keystream prefix from one known plaintext/ciphertext pair, then apply it to another ciphertext encrypted with the same stream.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Known pair and target">
          <div className="grid gap-4">
            <Field label="Ciphertext with known plaintext hex"><textarea className="field min-h-24 font-mono" value={cipherKnown} onChange={(event) => setCipherKnown(event.target.value)} /></Field>
            <Field label="Known plaintext prefix"><input className="field font-mono" value={knownText} onChange={(event) => setKnownText(event.target.value)} /></Field>
            <Field label="Target ciphertext hex"><textarea className="field min-h-24 font-mono" value={cipherTarget} onChange={(event) => setCipherTarget(event.target.value)} /></Field>
            <button className="btn btn-primary w-fit" type="button" onClick={() => { setCipherKnown(encrypt(secretPlain)); setKnownText(knownPlain); setCipherTarget(encrypt(otherPlain)); }}>Load sample</button>
          </div>
        </Card>

        <Card title="Recovered prefix">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="error">Keystream reuse</StatusPill>
              <StatusPill tone="info">{Math.floor(keystreamPrefix.length / 2)} recovered bytes</StatusPill>
            </div>
            <ValueRow label="Recovered keystream prefix" value={keystreamPrefix} />
            <ValueRow label="Target plaintext prefix" value={recoveredTarget} />
            <WarningBadge>Never reuse one-time-pad material or stream cipher keystream. Known format bytes, headers, or protocol text can reveal the stream.</WarningBadge>
          </div>
        </Card>
      </div>
    </div>
  );
}
