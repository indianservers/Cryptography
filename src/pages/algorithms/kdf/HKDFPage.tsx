import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function HKDFPage() {
  return <AlgorithmPageShell title="HKDF" category="Key Derivation Functions" status="Modern" intro="Exact educational HKDF-SHA256 helper coverage exists for extract and expand; use demo key material only." inputs={["Demo input key material","Salt","Info","Hash"]} outputs={["PRK","OKM"]} visualizers={["Extract step","Expand blocks","Info label panel"]} notes={["HKDF is not a password hash; use it with high-entropy input key material and do not paste production secrets."]} />;
}
