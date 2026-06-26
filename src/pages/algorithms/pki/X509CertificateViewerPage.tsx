import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function X509CertificateViewerPage() {
  return <AlgorithmPageShell title="X.509 Certificate Viewer" category="Certificates and PKI" status="Educational" intro="Basic conceptual X.509 structure viewer; it does not perform trust, hostname, revocation, time, chain, or signature validation." inputs={["Demo certificate PEM"]} outputs={["Subject concept","Issuer concept","Validity fields","Extensions outline"]} visualizers={["Certificate field table","Validation checklist"]} notes={["Parsing fields is not the same as trusting a certificate. Do not paste production certificates or private material."]} />;
}
