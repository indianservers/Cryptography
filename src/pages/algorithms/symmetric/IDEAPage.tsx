import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function IDEAPage() {
  return <AlgorithmPageShell title="IDEA" category="Symmetric Cryptography" status="Legacy" intro="Combine XOR, modular addition, and modular multiplication in IDEA rounds." inputs={["64-bit block","128-bit key"]} outputs={["Cipher block","Subkey list"]} visualizers={["Mixed operation round","Modulo 65537 multiplication"]} notes={["IDEA is historically important but uncommon in new systems."]} />;
}

