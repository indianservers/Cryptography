import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BitcoinHashingPage() {
  return <AlgorithmPageShell title="Bitcoin Hashing" category="Blockchain Cryptography" status="Educational" intro="Inspect double SHA-256 style block hashing and target comparison." inputs={["Header fields","Nonce"]} outputs={["Header hash","Target comparison"]} visualizers={["Header byte order view","Double-hash flow"]} notes={["Mining security depends on network consensus, not just one hash."]} />;
}

