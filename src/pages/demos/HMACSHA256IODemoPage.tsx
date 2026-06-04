import { useEffect, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, hmacSha256Hex } from "../../lib/simpleDemos";

const sample = {
  message: "Transfer amount=100",
  key: "shared signing key",
};

export default function HMACSHA256IODemoPage() {
  const [message, setMessage] = useState(sample.message);
  const [key, setKey] = useState(sample.key);
  const [tag, setTag] = useState("");

  useEffect(() => {
    if (asciiError(message) || asciiError(key)) {
      setTag("");
      return;
    }
    let active = true;
    hmacSha256Hex(key, message).then((value) => active && setTag(value)).catch((error) => active && setTag(error instanceof Error ? error.message : "HMAC failed"));
    return () => { active = false; };
  }, [key, message]);

  return (
    <SimpleDemoShell
      title="HMAC-SHA256 Input / Output"
      status="Modern"
      fields={[
        { label: "Message", value: message, onChange: setMessage, multiline: true, error: asciiError(message, "Message") },
        { label: "ASCII key text", value: key, onChange: setKey, error: asciiError(key, "Key") },
      ]}
      outputs={[
        { label: "Authentication tag", value: tag },
        { label: "Verification result", value: tag ? "Same key and message reproduce this tag" : "" },
      ]}
      notes={["HMAC authenticates a message with a shared secret. It does not hide the message content."]}
      onSample={() => { setMessage(sample.message); setKey(sample.key); }}
      onReset={() => { setMessage(""); setKey(""); }}
    >
      Create a message authentication code from ASCII message and key text.
    </SimpleDemoShell>
  );
}
