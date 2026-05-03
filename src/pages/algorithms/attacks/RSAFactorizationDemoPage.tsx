import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RSAFactorizationDemoPage() {
  return <AlgorithmPageShell title="RSA Factorization Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Factor only small educational n values with trial division." inputs={["Small n","Max divisor"]} outputs={["Factors","Trial table"]} visualizers={["Division timeline","Infeasibility explanation"]} notes={["Real RSA moduli are far beyond trial division."]} />;
}

