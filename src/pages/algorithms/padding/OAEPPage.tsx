import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function OAEPPage() {
  return <AlgorithmPageShell title="RSA-OAEP" category="Padding Schemes" status="Modern" intro="Conceptual OAEP structure preview showing label hash, seed, MGF1, masked DB, and masked seed; exact encoding is verification pending." inputs={["Demo message","Label","Seed concept"]} outputs={["Encoded structure concept","maskedDB concept","maskedSeed concept"]} visualizers={["MGF1 diagram","DB construction","Masking table"]} notes={["OAEP must be checked carefully to avoid oracle leaks; do not treat this output as standards-compliant RSA padding."]} />;
}
