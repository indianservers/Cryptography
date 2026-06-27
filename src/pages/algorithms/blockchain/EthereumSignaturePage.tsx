import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function EthereumSignaturePage() {
  return <AlgorithmPageShell title="Ethereum Signature" category="Blockchain Cryptography" status="Educational" intro="Live Ethereum signing-field model; this page is not a wallet and does not create real secp256k1 signatures." inputs={["Message","Demo private key text","Chain context"]} outputs={["r/s/v field concept","Recovered address concept"]} visualizers={["Keccak hash concept","Signature field table"]} notes={["Exact Ethereum signatures require secp256k1, Keccak, recovery, message-format vectors, and never real private keys."]} />;
}
