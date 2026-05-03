import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ECCCurveExplorerPage() {
  return <AlgorithmPageShell title="ECC Curve Explorer" category="Elliptic Curve Cryptography" status="Educational" intro="Plot toy elliptic curve points over a finite field and perform group operations." inputs={["a","b","p","Point P","Point Q","Scalar k"]} outputs={["P+Q","2P","kP"]} visualizers={["Finite-field point plot","Slope formula table"]} notes={["Small fields make patterns visible but are not secure."]} />;
}

