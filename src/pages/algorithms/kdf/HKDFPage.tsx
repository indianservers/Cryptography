import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function HKDFPage() {
  return <AlgorithmPageShell title="HKDF" category="Key Derivation Functions" status="Modern" intro="Separate extraction from expansion to derive context-bound keys." inputs={["Input key material","Salt","Info","Hash"]} outputs={["PRK","OKM"]} visualizers={["Extract step","Expand blocks","Info label panel"]} notes={["HKDF is not a password hash; use it with high-entropy input key material."]} />;
}

