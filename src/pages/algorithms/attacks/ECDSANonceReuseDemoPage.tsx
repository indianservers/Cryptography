import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECDSANonceReuseDemoPage() {
  return <AlgorithmPageShell title="ECDSA Nonce Reuse Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Defensive toy arithmetic showing why repeated ECDSA nonce k can leak a private key; this is not a real-signature recovery tool." inputs={["Toy q","r","s1","s2","hashes"]} outputs={["Recovered k concept","Private key concept"]} visualizers={["Formula derivation panel","Two-signature table"]} notes={["Use only for authorized learning; real systems should use deterministic or high-quality nonce generation."]} />;
}
