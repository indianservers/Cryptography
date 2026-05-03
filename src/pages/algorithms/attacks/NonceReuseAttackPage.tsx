import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function NonceReuseAttackPage() {
  return <AlgorithmPageShell title="Nonce Reuse Attack Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Show how stream cipher nonce reuse makes C1 XOR C2 equal P1 XOR P2 on local sample data." inputs={["Plaintext 1","Plaintext 2","Shared keystream"]} outputs={["C1 XOR C2","P1 XOR P2"]} visualizers={["XOR comparison table","Reuse warning diagram"]} notes={["Never reuse stream-cipher nonces with the same key."]} />;
}

