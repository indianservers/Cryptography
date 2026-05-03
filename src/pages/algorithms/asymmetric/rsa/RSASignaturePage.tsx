import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function RSASignaturePage() {
  return <AlgorithmPageShell title="RSA Signature" category="Public Key Cryptography" status="Modern" intro="Hash a message and sign it with RSA-PSS or compare legacy PKCS#1 v1.5 structure." inputs={["Message","Hash selector","Private key fields","Padding mode"]} outputs={["Signature integer","Verify result"]} visualizers={["Hash-to-encoded-message","PSS salt panel","Verification exponentiation"]} notes={["Never sign raw messages; sign a well-defined encoded hash."]} />;
}

