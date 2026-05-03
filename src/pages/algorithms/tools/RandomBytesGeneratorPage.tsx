import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RandomBytesGeneratorPage() {
  return <AlgorithmPageShell title="Random Bytes Generator" category="Randomness and Entropy" status="Modern" intro="Generate local random bytes with Web Crypto getRandomValues." inputs={["Byte count","Output format"]} outputs={["Random bytes","Entropy estimate"]} visualizers={["Byte grid","Distribution chart"]} notes={["Browser CSPRNG output should be kept secret when used as key material."]} />;
}

