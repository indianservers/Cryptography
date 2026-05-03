import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECDHPage() {
  return <AlgorithmPageShell title="ECDH" category="Elliptic Curve Cryptography" status="Modern" intro="Derive a shared point by multiplying public keys by private scalars." inputs={["Curve","Alice scalar","Bob scalar"]} outputs={["Public points","Shared point","Derived key"]} visualizers={["Scalar multiplication ladder","Exchange diagram"]} notes={["Validate peer public keys before deriving secrets."]} />;
}

