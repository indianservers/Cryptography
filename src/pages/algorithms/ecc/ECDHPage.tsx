import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECDHPage() {
  return <AlgorithmPageShell title="ECDH" category="Elliptic Curve Cryptography" status="Modern" intro="Toy ECDH concept preview: small-curve arithmetic may be shown, but this is not P-256 or X25519 correctness." inputs={["Toy curve","Alice demo scalar","Bob demo scalar"]} outputs={["Public point concepts","Shared point concept","Derived key concept"]} visualizers={["Scalar multiplication ladder","Exchange diagram"]} notes={["Validate peer public keys before deriving secrets; exact ECDH needs vetted curve support and vectors."]} />;
}
