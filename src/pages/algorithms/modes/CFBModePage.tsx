import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CFBModePage() {
  return <AlgorithmPageShell title="CFB Mode" category="Modes of Operation" status="Legacy" intro="Turn a block cipher into a self-synchronizing stream-like mode." inputs={["Plaintext","IV","Segment size"]} outputs={["Ciphertext","Feedback register"]} visualizers={["Encrypted feedback block","Segment shift"]} notes={["CFB provides confidentiality only; add authentication."]} />;
}

