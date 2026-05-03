import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ElGamalPage() {
  return <AlgorithmPageShell title="ElGamal" category="Public Key Cryptography" status="Educational" intro="Use a fresh random k to encrypt through discrete logarithm arithmetic." inputs={["p","g","public key y","message","ephemeral k"]} outputs={["c1","c2","shared secret"]} visualizers={["Exponentiation flow","Ephemeral key warning"]} notes={["Reusing k breaks ElGamal confidentiality."]} />;
}

