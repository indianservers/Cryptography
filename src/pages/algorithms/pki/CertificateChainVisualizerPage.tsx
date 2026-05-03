import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CertificateChainVisualizerPage() {
  return <AlgorithmPageShell title="Certificate Chain Visualizer" category="Certificates and PKI" status="Educational" intro="Connect leaf, intermediate, and root certificates in a trust chain diagram." inputs={["Leaf certificate","Intermediate certificate","Root certificate"]} outputs={["Chain order","Conceptual verification"]} visualizers={["Chain graph","Issuer/subject matching table"]} notes={["Trust depends on root stores, policies, names, and revocation, not just signatures."]} />;
}

