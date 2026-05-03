import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BenchmarkPage() {
  return <AlgorithmPageShell title="Browser Benchmark" category="Benchmark and Comparison" status="Educational" intro="Run local browser-only timing tests and chart throughput by input size." inputs={["Algorithm selector","Input size","Iterations"]} outputs={["Time taken","Throughput","Chart"]} visualizers={["Timing bars","Device variability warning"]} notes={["Browser benchmarks vary by device, tab state, and power settings."]} />;
}

