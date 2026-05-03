import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AES192StepPage() {
  return <AlgorithmPageShell title="AES-192 Step Visualizer" category="Block Ciphers" status="Educational" intro="Study the 12-round AES variant with a 192-bit key schedule." inputs={["16-byte block","192-bit key","Round selector"]} outputs={["State after selected round","Expanded key words"]} visualizers={["Nk=6 key expansion","12-round timeline"]} notes={["AES-192 is less common than AES-128 and AES-256 but remains modern."]} />;
}

