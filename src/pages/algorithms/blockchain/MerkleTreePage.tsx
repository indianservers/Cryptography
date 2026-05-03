import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function MerkleTreePage() {
  return <AlgorithmPageShell title="Merkle Tree" category="Blockchain Cryptography" status="Educational" intro="Hash transactions pairwise into a Merkle root and inspect inclusion paths." inputs={["Leaf values","Hash selector"]} outputs={["Merkle root","Proof path"]} visualizers={["Tree diagram","Pair hashing table"]} notes={["Changing one leaf changes the root path upward."]} />;
}

