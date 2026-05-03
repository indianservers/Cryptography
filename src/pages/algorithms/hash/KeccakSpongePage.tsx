import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function KeccakSpongePage() {
  return <AlgorithmPageShell title="Keccak Sponge" category="Hash Functions" status="Educational" intro="Explore rate, capacity, padding, and lane permutations in the Keccak sponge." inputs={["Input bytes","Rate","Capacity"]} outputs={["Sponge state","Output bytes"]} visualizers={["5x5 lane view","Theta/Rho/Pi/Chi/Iota outline"]} notes={["Changing rate and capacity changes performance and security margin."]} />;
}

