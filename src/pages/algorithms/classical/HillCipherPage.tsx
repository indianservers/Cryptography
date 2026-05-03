import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function HillCipherPage() {
  return <AlgorithmPageShell title="Hill Cipher" category="Classical Cryptography" status="Educational" intro="Multiply letter vectors by an invertible key matrix modulo 26." inputs={["Matrix size","Key matrix","Plaintext blocks"]} outputs={["Cipher vectors","Determinant","Inverse validation"]} visualizers={["Matrix multiplication board","Determinant modulo 26","Block vector trace"]} notes={["A non-invertible matrix loses information and cannot be used for decryption."]} />;
}

