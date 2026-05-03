import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RC4Page() {
  return <AlgorithmPageShell title="RC4" category="Stream Ciphers" status="Deprecated" intro="Inspect RC4's KSA and PRGA and the biases that made it unsafe." inputs={["Key","Plaintext"]} outputs={["Keystream","Ciphertext"]} visualizers={["S array shuffle","i/j PRGA trace"]} notes={["RC4 must not be used for modern confidentiality."]} />;
}

