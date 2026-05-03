import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PEMDERViewerPage() {
  return <AlgorithmPageShell title="PEM/DER Viewer" category="Encoding Tools" status="Educational" intro="Paste PEM blocks and inspect headers, Base64 body, DER bytes, and a basic ASN.1 outline." inputs={["PEM text"]} outputs={["Detected block type","DER byte count","ASN.1 tree"]} visualizers={["PEM sections","Base64 body viewer","TLV rows"]} notes={["Parsing is local and educational; malformed inputs may not match strict certificate parsers."]} />;
}

