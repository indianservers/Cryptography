import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function RSAPaddingPage() {
  return <AlgorithmPageShell title="RSA Padding" category="Public Key Cryptography" status="Modern" intro="Compare OAEP and PSS encodings that make RSA safe in practice." inputs={["Message","Label","Salt or seed"]} outputs={["Encoded block","Masking components"]} visualizers={["MGF1 flow","masked DB","masked seed"]} notes={["Padding validation errors must avoid oracle behavior."]} />;
}

