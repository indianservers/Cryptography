import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BlowfishPage() {
  return <AlgorithmPageShell title="Blowfish" category="Symmetric Cryptography" status="Legacy" intro="Explore a 64-bit block cipher with expensive key setup and variable-length keys." inputs={["Plaintext block","Variable key"]} outputs={["Cipher block","P-array summary"]} visualizers={["Feistel diagram","Key setup outline"]} notes={["The 64-bit block size is too small for large modern data volumes."]} />;
}

