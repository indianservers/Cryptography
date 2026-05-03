import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function WalletKeyPairPage() {
  return <AlgorithmPageShell title="Wallet Key Pair" category="Blockchain Cryptography" status="Educational" intro="Show how private keys, public keys, and addresses relate conceptually." inputs={["Private key hex","Curve choice"]} outputs={["Public key","Address concept"]} visualizers={["Key derivation flow","Address hashing steps"]} notes={["Never paste real wallet private keys into educational tools."]} />;
}

