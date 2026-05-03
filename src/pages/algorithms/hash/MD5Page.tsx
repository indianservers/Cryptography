import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function MD5Page() {
  return <AlgorithmPageShell title="MD5" category="Hash Functions" status="Deprecated" intro="Compute and visualize MD5's Merkle-Damgard style rounds while flagging its broken collision resistance." inputs={["Message","Output format"]} outputs={["MD5 digest","Round words"]} visualizers={["Four round functions","512-bit block split"]} notes={["MD5 is broken for signatures, certificates, and integrity against attackers."]} />;
}

