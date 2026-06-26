import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BitcoinHashingPage() {
  return <AlgorithmPageShell title="Bitcoin Hashing" category="Blockchain Cryptography" status="Educational" intro="Exact double SHA-256 helper coverage exists for controlled bytes; full Bitcoin block-header serialization and mining target checks remain conceptual." inputs={["Header field concept","Nonce"]} outputs={["Double SHA-256 hash","Target comparison concept"]} visualizers={["Header byte order view","Double-hash flow"]} notes={["Mining correctness also depends on block-header serialization, endianness, compact target bits, and consensus rules."]} />;
}
