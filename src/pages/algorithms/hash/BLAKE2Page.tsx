import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BLAKE2Page() {
  return <AlgorithmPageShell title="BLAKE2" category="Hash Functions" status="Modern" intro="Use keyed or unkeyed BLAKE2 style hashing with digest-size choices." inputs={["Message","Optional key","Digest size"]} outputs={["Digest","Parameter block"]} visualizers={["G mixing function","Keyed hashing panel"]} notes={["Keyed hashing can act like a MAC when protocol requirements match."]} />;
}

