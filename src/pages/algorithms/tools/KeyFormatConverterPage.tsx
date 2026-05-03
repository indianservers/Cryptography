import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function KeyFormatConverterPage() {
  return <AlgorithmPageShell title="Key Format Converter" category="Encoding Tools" status="Educational" intro="Convert keys among raw hex, Base64, PEM-like wrapping, and JWK-style fields." inputs={["Key bytes","Source format","Target format"]} outputs={["Converted key","Length"]} visualizers={["Format table","Header/footer viewer"]} notes={["Changing format does not change the underlying key security."]} />;
}

