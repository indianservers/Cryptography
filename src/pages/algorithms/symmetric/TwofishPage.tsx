import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function TwofishPage() {
  return <AlgorithmPageShell title="Twofish" category="Symmetric Cryptography" status="Modern" intro="Inspect the AES finalist with key-dependent S-boxes and an MDS matrix." inputs={["Plaintext block","128/192/256-bit key"]} outputs={["Cipher block","Round trace"]} visualizers={["Whitening keys","g function","Feistel-like rounds"]} notes={["Twofish is sound but less commonly available in browser-native APIs."]} />;
}

