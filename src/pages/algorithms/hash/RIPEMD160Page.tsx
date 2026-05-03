import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RIPEMD160Page() {
  return <AlgorithmPageShell title="RIPEMD-160" category="Hash Functions" status="Legacy" intro="Show RIPEMD-160's dual-line compression used historically in blockchain addresses." inputs={["Message"]} outputs={["160-bit digest","Parallel lane state"]} visualizers={["Left/right line table","Round constants"]} notes={["RIPEMD-160 is legacy; choose modern hashes for new designs."]} />;
}

