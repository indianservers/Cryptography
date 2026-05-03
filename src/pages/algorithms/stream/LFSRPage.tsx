import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function LFSRPage() {
  return <AlgorithmPageShell title="LFSR" category="Stream Ciphers" status="Educational" intro="Generate toy keystream bits from a linear feedback shift register." inputs={["Seed bits","Tap positions","Clock count"]} outputs={["Generated bits","Period estimate"]} visualizers={["Shift register cells","Feedback XOR trace"]} notes={["Plain LFSRs are linear and need nonlinear combining for real ciphers."]} />;
}

