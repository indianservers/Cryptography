import { useEffect, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { aesGcmDecryptBase64, aesGcmEncryptBase64, asciiError, shaHex } from "../../lib/simpleDemos";

const sample = {
  plaintext: "Attack at dawn",
  key: "correct horse battery staple",
  nonce: "unique nonce",
};

export default function AESIODemoPage() {
  const [plaintext, setPlaintext] = useState(sample.plaintext);
  const [key, setKey] = useState(sample.key);
  const [nonce, setNonce] = useState(sample.nonce);
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [keyDigest, setKeyDigest] = useState("");

  useEffect(() => {
    const errors = [plaintext, key, nonce].map((value) => asciiError(value)).filter(Boolean);
    if (errors.length) {
      setCiphertext("");
      setDecrypted("");
      setKeyDigest("");
      return;
    }
    let active = true;
    Promise.all([
      aesGcmEncryptBase64(plaintext, key, nonce),
      shaHex("SHA-256", key),
    ]).then(async ([encrypted, digest]) => {
      const roundTrip = await aesGcmDecryptBase64(encrypted, key, nonce);
      if (active) {
        setCiphertext(encrypted);
        setDecrypted(roundTrip);
        setKeyDigest(digest);
      }
    }).catch((error) => {
      if (active) {
        setCiphertext(error instanceof Error ? error.message : "AES-GCM failed");
        setDecrypted("");
      }
    });
    return () => { active = false; };
  }, [plaintext, key, nonce]);

  return (
    <SimpleDemoShell
      title="AES Encrypt / Decrypt"
      status="Modern"
      fields={[
        { label: "Plain text", value: plaintext, onChange: setPlaintext, multiline: true, error: asciiError(plaintext, "Plain text") },
        { label: "ASCII key text", value: key, onChange: setKey, hint: "The page derives a 256-bit AES key from this ASCII text with SHA-256.", error: asciiError(key, "Key") },
        { label: "ASCII nonce", value: nonce, onChange: setNonce, hint: "AES-GCM uses 12 nonce bytes internally; this value is padded or truncated locally.", error: asciiError(nonce, "Nonce") },
      ]}
      outputs={[
        { label: "Encrypted ciphertext", value: ciphertext },
        { label: "Decrypted round-trip", value: decrypted },
        { label: "Derived key fingerprint", value: keyDigest ? keyDigest.slice(0, 32) : "" },
      ]}
      notes={["AES is modern, but use authenticated modes such as GCM and never reuse the same nonce with the same key for different messages."]}
      onSample={() => { setPlaintext(sample.plaintext); setKey(sample.key); setNonce(sample.nonce); }}
      onReset={() => { setPlaintext(""); setKey(""); setNonce(""); }}
    >
      Encrypt ASCII plaintext with AES-GCM and immediately decrypt the produced ciphertext on the same page.
    </SimpleDemoShell>
  );
}
