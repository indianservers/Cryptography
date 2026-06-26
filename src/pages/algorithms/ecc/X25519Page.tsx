import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function X25519Page() {
  return <AlgorithmPageShell title="X25519" category="Elliptic Curve Cryptography" status="Modern" intro="Conceptual preview of Curve25519 key agreement and scalar clamping; this page does not compute real X25519 shared secrets." inputs={["Demo private scalar","Peer public key concept"]} outputs={["Shared secret concept","Clamped scalar concept"]} visualizers={["Montgomery ladder sketch","Scalar clamping panel"]} notes={["Exact X25519 requires Web Crypto support or a vetted library with vectors; X25519 is for key agreement, not signatures."]} />;
}
