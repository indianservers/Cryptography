import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function OAEPPage() {
  return <AlgorithmPageShell title="RSA-OAEP" category="Padding Schemes" status="Modern" intro="Encode RSA encryption messages using label hash, seed, MGF1, masked DB, and masked seed." inputs={["Message","Label","Seed"]} outputs={["Encoded message","maskedDB","maskedSeed"]} visualizers={["MGF1 diagram","DB construction","Masking table"]} notes={["OAEP must be checked carefully to avoid oracle leaks."]} />;
}

