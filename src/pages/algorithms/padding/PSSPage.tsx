import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PSSPage() {
  return <AlgorithmPageShell title="RSA-PSS" category="Padding Schemes" status="Modern" intro="Prepare RSA signatures with randomized salt and MGF1 masking." inputs={["Message hash","Salt","Modulus length"]} outputs={["Encoded message","PSS fields"]} visualizers={["Salted hash","MGF1 mask","Trailer byte"]} notes={["PSS is preferred over legacy PKCS#1 v1.5 signatures."]} />;
}

