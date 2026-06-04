import { useMemo, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, asciiToFixedHex, desDecryptBase64, desEncryptBase64 } from "../../lib/simpleDemos";

const sample = {
  plaintext: "DES demo block",
  key: "old-key!",
};

export default function DESIODemoPage() {
  const [plaintext, setPlaintext] = useState(sample.plaintext);
  const [key, setKey] = useState(sample.key);

  const { ciphertext, decrypted } = useMemo(() => {
    if (asciiError(plaintext) || asciiError(key)) return { ciphertext: "", decrypted: "" };
    try {
      const encrypted = desEncryptBase64(plaintext, key);
      return { ciphertext: encrypted, decrypted: desDecryptBase64(encrypted, key) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "DES failed";
      return { ciphertext: message, decrypted: "" };
    }
  }, [plaintext, key]);

  return (
    <SimpleDemoShell
      title="DES Encrypt / Decrypt"
      status="Deprecated"
      fields={[
        { label: "Plain text", value: plaintext, onChange: setPlaintext, multiline: true, error: asciiError(plaintext, "Plain text") },
        { label: "ASCII key text", value: key, onChange: setKey, hint: "DES uses the first 8 ASCII bytes internally and pads short keys with zero bytes.", error: asciiError(key, "Key") },
      ]}
      outputs={[
        { label: "Encrypted ciphertext", value: ciphertext },
        { label: "Decrypted round-trip", value: decrypted },
        { label: "Internal 8-byte key material", value: asciiError(key) ? "" : asciiToFixedHex(key, 8) },
      ]}
      notes={["DES is deprecated because its effective key size is too small. Keep it for learning and compatibility discussions only."]}
      onSample={() => { setPlaintext(sample.plaintext); setKey(sample.key); }}
      onReset={() => { setPlaintext(""); setKey(""); }}
    >
      Encrypt ASCII text with the existing DES core and decrypt the generated ciphertext on the same page.
    </SimpleDemoShell>
  );
}
