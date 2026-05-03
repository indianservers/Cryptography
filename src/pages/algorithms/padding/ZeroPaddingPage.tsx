import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ZeroPaddingPage() {
  return <AlgorithmPageShell title="Zero Padding" category="Padding Schemes" status="Unsafe" intro="Fill the final block with zeros and inspect ambiguity for binary data." inputs={["Input bytes","Block size"]} outputs={["Padded bytes","Ambiguity warning"]} visualizers={["Block grid","Trailing zero detector"]} notes={["Zero padding cannot distinguish real trailing zeros from padding."]} />;
}

