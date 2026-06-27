import { useMemo, useState } from "react";
import { Card } from "../../components/common/Field";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, asciiToFixedHex, desDecryptBase64, desEncryptBase64 } from "../../lib/simpleDemos";

const sample = {
  plaintext: "DES demo block",
  key: "old-key!",
};

export default function DESIODemoPage() {
  const [plaintext, setPlaintext] = useState(sample.plaintext);
  const [key, setKey] = useState(sample.key);
  const [stage, setStage] = useState(0);

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
      <div className="space-y-3">
        <p>Encrypt ASCII text with the existing DES core and decrypt the generated ciphertext on the same page.</p>
        <Card title="Active DES stage">
          <label className="block text-sm font-medium text-slate-700">Stage: {["Plaintext", "Initial permutation", "16 Feistel rounds", "Final permutation", "Ciphertext"][stage]}<input className="ml-3 w-48 align-middle" type="range" min="0" max="4" value={stage} onChange={(event) => setStage(Number(event.target.value))} /></label>
          <div className="mt-3 grid gap-2 text-xs md:grid-cols-5">
            {["Plaintext bytes", "IP reorders bits", "L/R halves swap", "FP reorders bits", "Output block"].map((label, index) => <div key={label} className={`rounded-md border p-2 ${index === stage ? "border-cyan-300 bg-cyan-50 font-semibold text-cyan-950" : "border-slate-200 bg-white text-slate-600"}`}>{label}</div>)}
          </div>
        </Card>
      </div>
    </SimpleDemoShell>
  );
}
