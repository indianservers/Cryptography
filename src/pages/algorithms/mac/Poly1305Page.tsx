import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Poly1305Page() {
  return <AlgorithmPageShell title="Poly1305" category="MAC Algorithms" status="Modern" intro="Evaluate a polynomial modulo 2^130-5 using a one-time key." inputs={["One-time key","Message"]} outputs={["Tag","Accumulator trace"]} visualizers={["Block clamping","Polynomial accumulator"]} notes={["Never reuse a Poly1305 one-time key for two messages."]} />;
}

