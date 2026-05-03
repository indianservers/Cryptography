import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function FrequencyAnalysisPage() {
  return <AlgorithmPageShell title="Frequency Analysis" category="Cryptanalysis and Attacks" status="Educational" intro="Count letters and compare them to English frequencies for substitution-style ciphers." inputs={["Ciphertext"]} outputs={["Letter counts","Frequency chart","English comparison"]} visualizers={["Histogram","Top letters table"]} notes={["This demo analyzes local text only and does not target systems."]} />;
}

