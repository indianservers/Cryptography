import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function OFBModePage() {
  return <AlgorithmPageShell title="OFB Mode" category="Modes of Operation" status="Legacy" intro="Generate a keystream by repeatedly encrypting feedback state." inputs={["Plaintext","IV"]} outputs={["Keystream","Ciphertext"]} visualizers={["Feedback loop","XOR stream panel"]} notes={["IV reuse repeats keystream and is dangerous."]} />;
}

