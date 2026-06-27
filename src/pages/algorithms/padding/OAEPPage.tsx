import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function OAEPPage() {
  return <AlgorithmPageShell title="RSA-OAEP" category="Padding Schemes" status="Modern" intro="Live OAEP structure model showing label hash, seed, MGF1, masked DB, and masked seed; this is a teaching view, not standards-compliant encoded output." inputs={["Demo message","Label","Seed concept"]} outputs={["Encoded structure concept","maskedDB concept","maskedSeed concept"]} visualizers={["MGF1 diagram","DB construction","Masking table"]} notes={["OAEP must be checked carefully to avoid oracle leaks; do not treat this output as standards-compliant RSA padding."]} />;
}
