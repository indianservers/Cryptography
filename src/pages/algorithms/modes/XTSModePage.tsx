import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function XTSModePage() {
  return <AlgorithmPageShell title="XTS Mode" category="Modes of Operation" status="Modern" intro="Conceptual preview of tweakable storage encryption for disk sectors; this is not an AES-XTS implementation." inputs={["Sector data concept","Tweak concept","Key pair concept"]} outputs={["Ciphertext sector concept","Tweak sequence concept"]} visualizers={["Tweak multiplication","Block mask flow"]} notes={["Exact XTS needs tested AES-XTS sector vectors. XTS is for storage encryption, not general message encryption."]} />;
}
