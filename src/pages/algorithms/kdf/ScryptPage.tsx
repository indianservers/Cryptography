import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ScryptPage() {
  return <AlgorithmPageShell title="Scrypt" category="Key Derivation Functions" status="Modern" intro="Estimate memory-hard password derivation parameters N, r, and p." inputs={["Password","Salt","N","r","p"]} outputs={["Derived key preview","Memory estimate"]} visualizers={["ROMix memory grid","Cost calculator"]} notes={["Browser-native Web Crypto does not include scrypt, so production use needs vetted WASM."]} />;
}
