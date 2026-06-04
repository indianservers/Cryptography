import { useEffect, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, shaHex } from "../../lib/simpleDemos";

const sampleMessage = "abc";

export default function SHA256IODemoPage() {
  const [message, setMessage] = useState(sampleMessage);
  const [digest, setDigest] = useState("");

  useEffect(() => {
    if (asciiError(message)) {
      setDigest("");
      return;
    }
    let active = true;
    shaHex("SHA-256", message).then((value) => active && setDigest(value)).catch((error) => active && setDigest(error instanceof Error ? error.message : "SHA-256 failed"));
    return () => { active = false; };
  }, [message]);

  return (
    <SimpleDemoShell
      title="SHA-256 Input / Output"
      status="Modern"
      fields={[{ label: "Message", value: message, onChange: setMessage, multiline: true, error: asciiError(message, "Message") }]}
      outputs={[
        { label: "SHA-256 digest", value: digest },
        { label: "Message size", value: `${new TextEncoder().encode(message).length} bytes` },
      ]}
      notes={["SHA-256 is a one-way hash, not encryption. There is no decryption operation for a digest."]}
      onSample={() => setMessage(sampleMessage)}
      onReset={() => setMessage("")}
    >
      Hash ASCII text and show the final SHA-256 output only.
    </SimpleDemoShell>
  );
}
