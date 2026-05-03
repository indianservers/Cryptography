import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RailFenceCipherPage() {
  return <AlgorithmPageShell title="Rail Fence Cipher" category="Classical Cryptography" status="Educational" intro="Write characters along a zig-zag rail pattern and read rows to transpose the message." inputs={["Plaintext","Rail count"]} outputs={["Ciphertext","Rail rows"]} visualizers={["Zig-zag rail grid","Readout order"]} notes={["Transposition hides positions but not the original letters."]} />;
}

