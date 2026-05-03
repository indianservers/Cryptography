import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function AlgorithmComparisonPage() {
  return <AlgorithmPageShell title="Algorithm Comparison" category="Benchmark and Comparison" status="Educational" intro="Compare algorithms by purpose, key sizes, status, and browser support." inputs={["Algorithm filters","Use case"]} outputs={["Comparison table","Recommendation notes"]} visualizers={["Status matrix","Use-case tabs"]} notes={["Protocol context matters more than picking a famous primitive."]} />;
}

