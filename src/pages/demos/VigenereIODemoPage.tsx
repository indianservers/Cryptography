import { useMemo, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError } from "../../lib/simpleDemos";

const normalizeKey = (key: string) => key.toUpperCase().replace(/[^A-Z]/g, "");

const transform = (value: string, key: string, decrypt = false) => {
  const cleanKey = normalizeKey(key);
  if (!cleanKey) return "";
  let index = 0;
  return value.replace(/[a-z]/gi, (char) => {
    const base = char >= "a" && char <= "z" ? 97 : 65;
    const shift = cleanKey.charCodeAt(index % cleanKey.length) - 65;
    index += 1;
    return String.fromCharCode(((char.charCodeAt(0) - base + (decrypt ? -shift : shift) + 2600) % 26) + base);
  });
};

export default function VigenereIODemoPage() {
  const [plaintext, setPlaintext] = useState("Attack at dawn");
  const [key, setKey] = useState("LEMON");
  const ciphertext = useMemo(() => asciiError(plaintext) || asciiError(key) ? "" : transform(plaintext, key), [key, plaintext]);

  return (
    <SimpleDemoShell
      title="Vigenere Cipher Input / Output"
      status="Educational"
      fields={[
        { label: "Plain text", value: plaintext, onChange: setPlaintext, multiline: true, error: asciiError(plaintext, "Plain text") },
        { label: "Keyword", value: key, onChange: setKey, error: asciiError(key, "Keyword") || (normalizeKey(key) ? "" : "Keyword needs at least one A-Z letter.") },
      ]}
      outputs={[
        { label: "Encrypted ciphertext", value: ciphertext },
        { label: "Decrypted round-trip", value: ciphertext ? transform(ciphertext, key, true) : "" },
      ]}
      notes={["Vigenere is stronger than Caesar historically, but repeated-key patterns make it unsuitable for modern security."]}
      onSample={() => { setPlaintext("Attack at dawn"); setKey("LEMON"); }}
      onReset={() => { setPlaintext(""); setKey(""); }}
    >
      Encrypt and decrypt ASCII text with a repeated keyword.
    </SimpleDemoShell>
  );
}
