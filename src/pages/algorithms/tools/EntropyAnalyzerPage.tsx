import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function EntropyAnalyzerPage() {
  return <AlgorithmPageShell title="Entropy Analyzer" category="Randomness and Entropy" status="Educational" intro="Estimate symbol distribution and rough Shannon entropy for local input." inputs={["Sample text or hex"]} outputs={["Entropy estimate","Symbol table"]} visualizers={["Frequency table","Entropy bar"]} notes={["Entropy estimates from small samples are unreliable."]} />;
}

