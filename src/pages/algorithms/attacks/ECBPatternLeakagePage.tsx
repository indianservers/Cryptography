import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECBPatternLeakagePage() {
  return <AlgorithmPageShell title="ECB Pattern Leakage" category="Cryptanalysis and Attacks" status="Unsafe" intro="Detect repeated ciphertext blocks and visualize why ECB leaks structure." inputs={["Hex ciphertext blocks","Block size"]} outputs={["Repeated block groups","Pattern warning"]} visualizers={["Colored block grid","Duplicate table"]} notes={["ECB leaks equality of plaintext blocks."]} />;
}

