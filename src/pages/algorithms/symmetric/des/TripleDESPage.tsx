import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function TripleDESPage() {
  return <AlgorithmPageShell title="Triple DES" category="Symmetric Cryptography" status="Legacy" intro="Chain DES encrypt-decrypt-encrypt stages to extend practical key length." inputs={["Plaintext block","Keying option","K1/K2/K3"]} outputs={["EDE output","Stage trace"]} visualizers={["DES stage pipeline","Meet-in-the-middle note"]} notes={["3DES is legacy and should be replaced by AES where possible."]} />;
}

