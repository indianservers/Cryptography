import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CamelliaPage() {
  return <AlgorithmPageShell title="Camellia" category="Symmetric Cryptography" status="Modern" intro="Visualize Camellia's Feistel network, FL layers, and S-box substitutions." inputs={["Plaintext block","Key size"]} outputs={["Cipher block","Subkey layers"]} visualizers={["Feistel rounds","FL/FL-inverse markers"]} notes={["Camellia remains standardized and useful where supported."]} />;
}

