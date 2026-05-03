import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PaddingOracleConceptPage() {
  return <AlgorithmPageShell title="Padding Oracle Concept" category="Cryptanalysis and Attacks" status="Educational" intro="Explain how different padding errors can leak plaintext in CBC systems." inputs={["Toy block","Oracle response mode"]} outputs={["Conceptual leak","Mitigation checklist"]} visualizers={["CBC block diagram","Error channel panel"]} notes={["Do not expose distinguishable padding failures."]} />;
}

