import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ScryptPage() {
  return <AlgorithmPageShell title="Scrypt" category="Key Derivation Functions" status="Modern" intro="Conceptual preview of scrypt parameters N, r, and p; this page explains memory cost and does not produce a production scrypt hash." inputs={["Demo password","Demo salt","N","r","p"]} outputs={["Parameter summary","Memory estimate"]} visualizers={["ROMix memory grid concept","Cost calculator"]} notes={["Browser-native Web Crypto does not include scrypt; exact output requires a vetted implementation and vectors."]} />;
}
