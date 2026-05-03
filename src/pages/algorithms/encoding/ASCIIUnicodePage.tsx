import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ASCIIUnicodePage() {
  return <AlgorithmPageShell title="ASCII and Unicode" category="Encoding Tools" status="Educational" intro="Inspect code points, UTF-8 bytes, and how text becomes input bytes." inputs={["Text","Normalization form"]} outputs={["Code points","UTF-8 bytes"]} visualizers={["Character table","UTF-8 byte sequence"]} notes={["Cryptography operates on bytes; text encoding must be explicit."]} />;
}

