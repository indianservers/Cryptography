import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function GCMModePage() {
  return <AlgorithmPageShell title="GCM Mode" category="Modes of Operation" status="Modern" intro="Combine CTR encryption with GHASH authentication over ciphertext and AAD." inputs={["Plaintext","Nonce","AAD"]} outputs={["Ciphertext","Authentication tag"]} visualizers={["CTR lane","GHASH lane","Tag generation"]} notes={["Nonce reuse can reveal plaintext relationships and break authentication."]} />;
}

