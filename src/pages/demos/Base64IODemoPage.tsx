import { useMemo, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, decodeBase64Text, encodeBase64Text } from "../../lib/simpleDemos";

const sampleText = "Mega Cryptography Suite";
const sampleBase64 = "TWVnYSBDcnlwdG9ncmFwaHkgU3VpdGU=";

export default function Base64IODemoPage() {
  const [text, setText] = useState(sampleText);
  const [base64, setBase64] = useState(sampleBase64);

  const decoded = useMemo(() => {
    try {
      return decodeBase64Text(base64);
    } catch {
      return "Invalid Base64 input";
    }
  }, [base64]);

  return (
    <SimpleDemoShell
      title="Base64 Encode / Decode"
      status="Educational"
      fields={[
        { label: "Text to encode", value: text, onChange: setText, multiline: true, error: asciiError(text, "Text") },
        { label: "Base64 to decode", value: base64, onChange: setBase64, multiline: true },
      ]}
      outputs={[
        { label: "Encoded Base64", value: asciiError(text) ? "" : encodeBase64Text(text) },
        { label: "Decoded text", value: decoded },
      ]}
      notes={["Base64 is an encoding format, not encryption. It is useful when binary data needs to travel through text-only systems."]}
      onSample={() => { setText(sampleText); setBase64(sampleBase64); }}
      onReset={() => { setText(""); setBase64(""); }}
    >
      Encode ASCII text to Base64 and decode Base64 back to text on the same page.
    </SimpleDemoShell>
  );
}
