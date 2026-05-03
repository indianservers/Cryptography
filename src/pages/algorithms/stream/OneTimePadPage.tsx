import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function OneTimePadPage() {
  return <AlgorithmPageShell title="One-Time Pad" category="Stream Ciphers" status="Educational" intro="XOR a message with truly random key material of equal length." inputs={["Plaintext","Pad bytes"]} outputs={["Ciphertext","Recovered plaintext"]} visualizers={["XOR byte table","Pad length checker"]} notes={["The pad must be random, secret, as long as the message, and never reused."]} />;
}

