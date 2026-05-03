import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CTRModePage() {
  return <AlgorithmPageShell title="CTR Mode" category="Modes of Operation" status="Modern" intro="Encrypt nonce-counter blocks to create a parallelizable keystream." inputs={["Plaintext","Nonce","Initial counter"]} outputs={["Keystream blocks","Ciphertext"]} visualizers={["Nonce+counter table","Parallel block encryption","XOR lane"]} notes={["Never repeat nonce/counter pairs under the same key."]} />;
}

