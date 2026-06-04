import { useMemo, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError } from "../../lib/simpleDemos";

const caesar = (value: string, shift: number) => value.replace(/[a-z]/gi, (char) => {
  const base = char >= "a" && char <= "z" ? 97 : 65;
  return String.fromCharCode(((char.charCodeAt(0) - base + shift + 2600) % 26) + base);
});

export default function CaesarIODemoPage() {
  const [plaintext, setPlaintext] = useState("Attack at dawn");
  const [shift, setShift] = useState("3");
  const shiftValue = Number(shift) || 0;
  const ciphertext = useMemo(() => asciiError(plaintext) ? "" : caesar(plaintext, shiftValue), [plaintext, shiftValue]);

  return (
    <SimpleDemoShell
      title="Caesar Cipher Input / Output"
      status="Unsafe"
      fields={[
        { label: "Plain text", value: plaintext, onChange: setPlaintext, multiline: true, error: asciiError(plaintext, "Plain text") },
        { label: "Shift", value: shift, onChange: setShift, error: Number.isNaN(Number(shift)) ? "Shift must be a number." : "" },
      ]}
      outputs={[
        { label: "Encrypted ciphertext", value: ciphertext },
        { label: "Decrypted round-trip", value: ciphertext ? caesar(ciphertext, -shiftValue) : "" },
      ]}
      notes={["Caesar is a teaching cipher only. Its 26 possible shifts can be brute-forced instantly."]}
      onSample={() => { setPlaintext("Attack at dawn"); setShift("3"); }}
      onReset={() => { setPlaintext(""); setShift("3"); }}
    >
      Encrypt and decrypt ASCII text using a simple alphabet shift.
    </SimpleDemoShell>
  );
}
