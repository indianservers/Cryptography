import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function X25519Page() {
  return <AlgorithmPageShell title="X25519" category="Elliptic Curve Cryptography" status="Modern" intro="Visualize Montgomery-ladder key agreement over Curve25519." inputs={["Private scalar","Peer public key"]} outputs={["Shared secret","Clamped scalar"]} visualizers={["Montgomery ladder sketch","Scalar clamping panel"]} notes={["X25519 is for key agreement, not signatures."]} />;
}

