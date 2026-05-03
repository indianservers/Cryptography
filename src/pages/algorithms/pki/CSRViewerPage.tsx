import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CSRViewerPage() {
  return <AlgorithmPageShell title="CSR Viewer" category="Certificates and PKI" status="Educational" intro="Inspect a certificate signing request's subject, public key, and requested extensions." inputs={["CSR PEM"]} outputs={["Subject","Public key","Attributes"]} visualizers={["CSR field table","Signature concept"]} notes={["A CSR proves possession of the private key but does not grant trust."]} />;
}

