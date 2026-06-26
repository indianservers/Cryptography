import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CertificateChainVisualizerPage() {
  return <AlgorithmPageShell title="Certificate Chain Visualizer" category="Certificates and PKI" status="Educational" intro="Conceptual trust-chain diagram for leaf, intermediate, and root certificates; this is not real chain validation." inputs={["Leaf certificate concept","Intermediate certificate concept","Root certificate concept"]} outputs={["Chain order concept","Validation checklist"]} visualizers={["Chain graph","Issuer/subject matching table"]} notes={["Trust depends on root stores, policies, names, time, revocation, and signatures, not just diagram order."]} />;
}
