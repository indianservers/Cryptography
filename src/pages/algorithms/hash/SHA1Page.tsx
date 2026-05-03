import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SHA1Page() {
  return <AlgorithmPageShell title="SHA-1" category="Hash Functions" status="Deprecated" intro="Inspect SHA-1's compression structure and its collision-risk warning." inputs={["Message","Output format"]} outputs={["SHA-1 digest","Word schedule"]} visualizers={["80-round timeline","Collision warning panel"]} notes={["SHA-1 should be replaced by SHA-256 or SHA-3 families."]} />;
}

