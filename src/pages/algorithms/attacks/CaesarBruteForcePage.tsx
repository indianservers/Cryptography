import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CaesarBruteForcePage() {
  return <AlgorithmPageShell title="Caesar Brute Force" category="Cryptanalysis and Attacks" status="Educational" intro="Try all 26 Caesar shifts and rank likely plaintexts." inputs={["Ciphertext"]} outputs={["All candidate shifts","Likely words"]} visualizers={["Shift table","Scoring panel"]} notes={["Small keyspaces can be exhausted instantly."]} />;
}

