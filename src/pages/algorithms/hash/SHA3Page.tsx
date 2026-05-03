import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SHA3Page() {
  return <AlgorithmPageShell title="SHA-3" category="Hash Functions" status="Modern" intro="Visualize the sponge construction that absorbs, permutes, and squeezes output." inputs={["Message","Digest size"]} outputs={["SHA-3 digest","Rate/capacity"]} visualizers={["Absorb phase","Keccak-f permutation","Squeeze phase"]} notes={["SHA-3 is structurally different from SHA-2 and useful for algorithm diversity."]} />;
}

