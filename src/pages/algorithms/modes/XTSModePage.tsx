import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function XTSModePage() {
  return <AlgorithmPageShell title="XTS Mode" category="Modes of Operation" status="Modern" intro="Apply tweakable block encryption for disk sectors." inputs={["Sector data","Tweak","Key pair"]} outputs={["Ciphertext sector","Tweak sequence"]} visualizers={["Tweak multiplication","Block mask flow"]} notes={["XTS is for storage encryption, not general message encryption."]} />;
}

