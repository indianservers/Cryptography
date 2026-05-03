import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Ed25519Page() {
  return <AlgorithmPageShell title="Ed25519" category="Elliptic Curve Cryptography" status="Modern" intro="Study deterministic Edwards-curve signatures with compact keys and signatures." inputs={["Seed","Message"]} outputs={["Public key","Signature","Verify result"]} visualizers={["Hash-derived nonce","Edwards point operation outline"]} notes={["Use vetted libraries or Web Crypto support where available."]} />;
}

