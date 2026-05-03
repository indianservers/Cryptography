import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ISO7816PaddingPage() {
  return <AlgorithmPageShell title="ISO/IEC 7816-4 Padding" category="Padding Schemes" status="Educational" intro="Append 0x80 followed by zero bytes until the block is full." inputs={["Input bytes","Block size"]} outputs={["Padded bytes","0x80 marker"]} visualizers={["Marker byte grid","Zero fill section"]} notes={["The first 0x80 from the end marks the padding boundary."]} />;
}

