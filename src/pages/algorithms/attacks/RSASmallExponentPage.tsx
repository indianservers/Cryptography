import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { integerNthRoot, modPow, parseBigInt } from "../../../lib/attacks";

export default function RSASmallExponentPage() {
  const [messageInput, setMessageInput] = useState("42");
  const [exponentInput, setExponentInput] = useState("3");
  const [modulusInput, setModulusInput] = useState("999999937");
  const [cipherInput, setCipherInput] = useState("");
  const message = useMemo(() => parseBigInt(messageInput, 0n), [messageInput]);
  const e = useMemo(() => parseBigInt(exponentInput, 3n), [exponentInput]);
  const n = useMemo(() => parseBigInt(modulusInput, 1n), [modulusInput]);
  const computedCipher = useMemo(() => modPow(message, e, n), [message, e, n]);
  const attackCipher = useMemo(() => cipherInput.trim() ? parseBigInt(cipherInput, computedCipher) : computedCipher, [cipherInput, computedCipher]);
  const root = useMemo(() => integerNthRoot(attackCipher, e), [attackCipher, e]);
  const exact = root ** e === attackCipher;
  const vulnerable = message ** e < n;

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Small Exponent Demo" category="Cryptanalysis and Attacks" status="Educational">
        Recover raw RSA messages when a small exponent is used without padding and m^e never wraps modulo n. This is the classic reason RSA encryption must use OAEP.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card title="Raw RSA values">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Message integer m"><input className="field font-mono" value={messageInput} onChange={(event) => setMessageInput(event.target.value)} /></Field>
            <Field label="Public exponent e"><input className="field font-mono" value={exponentInput} onChange={(event) => setExponentInput(event.target.value)} /></Field>
            <Field label="Modulus n"><input className="field font-mono" value={modulusInput} onChange={(event) => setModulusInput(event.target.value)} /></Field>
            <Field label="Cipher integer c (optional)"><input className="field font-mono" value={cipherInput} onChange={(event) => setCipherInput(event.target.value)} placeholder={computedCipher.toString()} /></Field>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" type="button" onClick={() => { setMessageInput("42"); setExponentInput("3"); setModulusInput("999999937"); setCipherInput(""); }}>Vulnerable sample</button>
            <button className="btn" type="button" onClick={() => { setMessageInput("12345"); setExponentInput("3"); setModulusInput("3233"); setCipherInput(""); }}>Wrapped sample</button>
          </div>
        </Card>

        <Card title="Attack result">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={vulnerable ? "error" : "success"}>{vulnerable ? "m^e < n, no wrap" : "Modulo wrap occurred"}</StatusPill>
              <StatusPill tone={exact ? "success" : "warning"}>{exact ? "Exact integer root" : "No exact root"}</StatusPill>
            </div>
            <ValueRow label="Computed c = m^e mod n" value={computedCipher.toString()} />
            <ValueRow label="Integer e-th root of c" value={root.toString()} />
            <ValueRow label="Recovered message" value={exact ? root.toString() : "not recovered by direct root"} />
            <WarningBadge>OAEP padding randomizes and expands the encoded message so direct integer-root recovery is not available.</WarningBadge>
          </div>
        </Card>
      </div>
    </div>
  );
}
