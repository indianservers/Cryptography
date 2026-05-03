import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BLAKE3Page() {
  return <AlgorithmPageShell title="BLAKE3" category="Hash Functions" status="Modern" intro="Inspect BLAKE3's tree hashing model and extendable output mode." inputs={["Message","Digest size","Keyed mode"]} outputs={["Digest","Chunk tree"]} visualizers={["Chunk compression","Parent node tree","Performance panel"]} notes={["BLAKE3 is fast and parallel, but browser support may rely on WASM libraries."]} />;
}

