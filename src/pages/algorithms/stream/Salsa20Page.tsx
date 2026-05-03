import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Salsa20Page() {
  return <AlgorithmPageShell title="Salsa20" category="Stream Ciphers" status="Modern" intro="Study the ARX stream cipher family that inspired ChaCha." inputs={["Key","Nonce","Counter"]} outputs={["Keystream","XOR output"]} visualizers={["State matrix","Double-round flow"]} notes={["Salsa20 uses addition, rotation, and XOR, avoiding S-box tables."]} />;
}

