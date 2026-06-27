import { useEffect, useState } from "react";
import { Card } from "../../components/common/Field";
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
        { label: "Output length", value: digest ? `${digest.length * 4} bits (${digest.length} hex chars)` : "" },
        { label: "Message size", value: `${new TextEncoder().encode(message).length} bytes` },
      ]}
      notes={[note]}
      onSample={() => setMessage("The quick brown fox jumps over the lazy dog")}
      onReset={() => setMessage("")}
    >
      <div className="space-y-3">
        <p>Enter ASCII text and view the final hash digest only.</p>
        <Card title="Hash output lengths">
          <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-5">
            {[["MD5", "128 bits"], ["SHA-1", "160 bits"], ["SHA-256", "256 bits"], ["SHA-384", "384 bits"], ["SHA-512", "512 bits"]].map(([name, size]) => <div key={name} className={`rounded-md border p-2 ${name === algorithm ? "border-cyan-300 bg-cyan-50 font-semibold" : "border-slate-200 bg-white"}`}><p>{name}</p><p className="font-mono">{size}</p></div>)}
          </div>
        </Card>
      </div>
    </SimpleDemoShell>
  );
}
