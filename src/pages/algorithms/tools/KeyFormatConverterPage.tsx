import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function KeyFormatConverterPage() {
  return <AlgorithmPageShell title="Key Format Converter" category="Encoding Tools" status="Educational" intro="Conceptual key-format structure converter for demo bytes only; it is not a safe private-key transformation tool." inputs={["Demo key bytes","Source format","Target format"]} outputs={["Converted structure concept","Length"]} visualizers={["Format table","Header/footer viewer"]} notes={["Do not paste real private keys. Changing format does not change the underlying key security."]} />;
}
