import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECDSANonceReuseDemoPage() {
  return <AlgorithmPageShell title="ECDSA Nonce Reuse Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Use small toy arithmetic to explain how repeated ECDSA nonce k leaks private keys." inputs={["Toy q","r","s1","s2","hashes"]} outputs={["Recovered k concept","Private key concept"]} visualizers={["Formula derivation panel","Two-signature table"]} notes={["Do not apply this to real signatures; use deterministic or high-quality nonce generation."]} />;
}

