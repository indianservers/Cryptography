import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AES256StepPage() {
  return <AlgorithmPageShell title="AES-256 Step Visualizer" category="Block Ciphers" status="Educational" intro="Inspect AES-256 with its 14 rounds and extra key schedule substitution step." inputs={["16-byte block","256-bit key","Round selector"]} outputs={["State matrix","Round key words"]} visualizers={["Nk=8 expansion","14-round timeline","Extra SubWord marker"]} notes={["More key bits do not remove the need for correct modes and nonce handling."]} />;
}

