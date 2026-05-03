import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function EthereumSignaturePage() {
  return <AlgorithmPageShell title="Ethereum Signature" category="Blockchain Cryptography" status="Educational" intro="Visualize message hashing and ECDSA-style signature fields used by Ethereum." inputs={["Message","Private key input","Chain context"]} outputs={["r/s/v fields","Recovered address concept"]} visualizers={["Keccak hash panel","Signature field table"]} notes={["Signing arbitrary messages can authorize unintended actions."]} />;
}
