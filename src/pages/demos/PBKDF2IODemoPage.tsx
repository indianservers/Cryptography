import { useEffect, useState } from "react";
import { SimpleDemoShell } from "../../components/common/SimpleDemoShell";
import { asciiError, pbkdf2Sha256Hex } from "../../lib/simpleDemos";

const sample = {
  password: "sample password",
  salt: "local demo salt",
  iterations: "100000",
};

export default function PBKDF2IODemoPage() {
  const [password, setPassword] = useState(sample.password);
  const [salt, setSalt] = useState(sample.salt);
  const [iterations, setIterations] = useState(sample.iterations);
  const [key, setKey] = useState("");
  const iterationCount = Math.max(1, Math.min(1000000, Number(iterations) || 1));

  useEffect(() => {
    if (asciiError(password) || asciiError(salt) || Number.isNaN(Number(iterations))) {
      setKey("");
      return;
    }
    let active = true;
    pbkdf2Sha256Hex(password, salt, iterationCount).then((value) => active && setKey(value)).catch((error) => active && setKey(error instanceof Error ? error.message : "PBKDF2 failed"));
    return () => { active = false; };
  }, [iterationCount, iterations, password, salt]);

  return (
    <SimpleDemoShell
      title="PBKDF2-SHA256 Input / Output"
      status="Modern"
      fields={[
        { label: "Password", value: password, onChange: setPassword, error: asciiError(password, "Password") },
        { label: "Salt", value: salt, onChange: setSalt, error: asciiError(salt, "Salt") },
        { label: "Iterations", value: iterations, onChange: setIterations, error: Number.isNaN(Number(iterations)) ? "Iterations must be a number." : "" },
      ]}
      outputs={[
        { label: "Derived 256-bit key", value: key },
        { label: "Applied iterations", value: String(iterationCount) },
      ]}
      notes={["PBKDF2 derives key material from a password and salt. Use high iteration counts and unique salts."]}
      onSample={() => { setPassword(sample.password); setSalt(sample.salt); setIterations(sample.iterations); }}
      onReset={() => { setPassword(""); setSalt(""); setIterations("100000"); }}
    >
      Derive key material from ASCII password and salt text.
    </SimpleDemoShell>
  );
}
