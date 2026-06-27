import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PSSPage() {
  return <AlgorithmPageShell title="RSA-PSS" category="Padding Schemes" status="Modern" intro="Live PSS structure model showing salt, MGF1 masking, and trailer byte; this is a teaching view, not standards-compliant signature encoding." inputs={["Message hash concept","Salt concept","Modulus length"]} outputs={["Encoded structure concept","PSS fields"]} visualizers={["Salted hash","MGF1 mask","Trailer byte"]} notes={["PSS is preferred over legacy PKCS#1 v1.5 signatures, but this page is not standards-compliant output."]} />;
}
