import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SelfSignedCertificateDemoPage() {
  return <AlgorithmPageShell title="Self-Signed Certificate Demo" category="Certificates and PKI" status="Educational" intro="Show why a certificate signed by its own key needs explicit trust." inputs={["Subject","Key type","Validity days"]} outputs={["Certificate concept","Trust warning"]} visualizers={["Self-signing diagram","Trust anchor comparison"]} notes={["Self-signed certificates can be useful internally but are not automatically trusted."]} />;
}

