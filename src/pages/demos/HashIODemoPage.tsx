import { useEffect, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { md5 } from "../../lib/hashCores";
import { asciiError, shaHex } from "../../lib/simpleDemos";
import type { SecurityStatus } from "../../types";

export function HashIODemoPage({
  title,
  algorithm,
  status,
  note,
}: {
  title: string;
  algorithm: "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
  status: SecurityStatus;
  note: string;
}) {
  const [message, setMessage] = useState("The quick brown fox jumps over the lazy dog");
  const [digest, setDigest] = useState("");

  useEffect(() => {
    if (asciiError(message)) {
      setDigest("");
      return;
    }
    let active = true;
    const work = algorithm === "MD5" ? Promise.resolve(md5(message).digest) : shaHex(algorithm, message);
    work.then((value) => active && setDigest(value)).catch((error) => active && setDigest(error instanceof Error ? error.message : `${algorithm} failed`));
    return () => { active = false; };
  }, [algorithm, message]);

  return (
    <SimpleDemoShell
      title={title}
      status={status}
      fields={[{ label: "Message", value: message, onChange: setMessage, multiline: true, error: asciiError(message, "Message") }]}
      outputs={[
        { label: `${algorithm} digest`, value: digest },
        { label: "Message size", value: `${new TextEncoder().encode(message).length} bytes` },
      ]}
      notes={[note]}
      onSample={() => setMessage("The quick brown fox jumps over the lazy dog")}
      onReset={() => setMessage("")}
    >
      Enter ASCII text and view the final hash digest only.
    </SimpleDemoShell>
  );
}
