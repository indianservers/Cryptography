import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PEMDERViewerPage() {
  return <AlgorithmPageShell title="PEM/DER Viewer" category="Encoding Tools" status="Educational" intro="Basic local PEM structure viewer with tested block extraction; strict DER ASN.1 and certificate validation are not implemented." inputs={["Demo PEM text"]} outputs={["Detected block type","DER byte count","ASN.1 outline concept"]} visualizers={["PEM sections","Base64 body viewer","TLV rows"]} notes={["Do not paste production private keys or certificates. Formal DER parsing needs vetted ASN.1 handling."]} />;
}
