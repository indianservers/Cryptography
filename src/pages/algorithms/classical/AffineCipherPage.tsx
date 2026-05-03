import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function AffineCipherPage() {
  return <AlgorithmPageShell title="Affine Cipher" category="Classical Cryptography" status="Educational" intro="Transform letters with E(x) = ax + b mod 26 and require a to be invertible." inputs={["Plaintext","Multiplier a","Offset b"]} outputs={["Ciphertext","Inverse key","GCD validation"]} visualizers={["Modulo line","Inverse calculation","Per-letter formula table"]} notes={["Only multipliers coprime with 26 can decrypt every letter."]} />;
}

