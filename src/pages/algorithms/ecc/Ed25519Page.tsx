import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Ed25519Page() {
  return <AlgorithmPageShell title="Ed25519" category="Elliptic Curve Cryptography" status="Modern" intro="Conceptual preview of deterministic Edwards-curve signature flow; this page does not output real Ed25519 signatures." inputs={["Demo seed","Message"]} outputs={["Public key concept","Signature structure","Verify concept"]} visualizers={["Hash-derived nonce concept","Edwards point operation outline"]} notes={["Exact Ed25519 requires Web Crypto support or a vetted library with official vectors."]} />;
}
