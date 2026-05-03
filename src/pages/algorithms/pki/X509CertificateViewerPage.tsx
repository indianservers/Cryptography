import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function X509CertificateViewerPage() {
  return <AlgorithmPageShell title="X.509 Certificate Viewer" category="Certificates and PKI" status="Educational" intro="Paste a certificate and inspect subject, issuer, validity, public key, signature, and extensions." inputs={["Certificate PEM"]} outputs={["Subject","Issuer","Validity","Extensions"]} visualizers={["Certificate field table","Validity timeline"]} notes={["Expired or mismatched certificates should not be trusted."]} />;
}

