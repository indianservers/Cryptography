import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function VigenereAttackPage() {
  return <AlgorithmPageShell title="Vigenere Attack Concepts" category="Cryptanalysis and Attacks" status="Educational" intro="Estimate key length and examine repeated-key leakage in Vigenere ciphertext." inputs={["Ciphertext","Max key length"]} outputs={["Index of coincidence","Repeated sequence candidates"]} visualizers={["IC chart","Key length table"]} notes={["This is an educational text analysis demo."]} />;
}

