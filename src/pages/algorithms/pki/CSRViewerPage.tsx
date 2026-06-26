import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CSRViewerPage() {
  return <AlgorithmPageShell title="CSR Viewer" category="Certificates and PKI" status="Educational" intro="Basic conceptual CSR structure viewer; it does not fully parse or validate certificate signing requests." inputs={["Demo CSR PEM"]} outputs={["Subject concept","Public key concept","Attributes outline"]} visualizers={["CSR field table","Signature concept"]} notes={["A CSR is not a certificate and does not grant trust. Formal parsing needs a vetted ASN.1/X.509 library."]} />;
}
