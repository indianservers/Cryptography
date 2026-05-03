import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SubstitutionCipherPage() {
  return <AlgorithmPageShell title="Monoalphabetic Substitution" category="Classical Cryptography" status="Unsafe" intro="Replace every plaintext letter with a fixed shuffled alphabet." inputs={["Plaintext","Substitution alphabet"]} outputs={["Ciphertext","Letter frequency"]} visualizers={["Mapping strip","Frequency comparison"]} notes={["Single-letter frequencies and common patterns reveal the substitution."]} />;
}

