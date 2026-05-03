import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ANSIX923PaddingPage() {
  return <AlgorithmPageShell title="ANSI X9.23 Padding" category="Padding Schemes" status="Educational" intro="Pad with zero bytes followed by a final length byte." inputs={["Input bytes","Block size"]} outputs={["Padded bytes","Length byte"]} visualizers={["Block grid","Zero padding region"]} notes={["The last byte tells how many padding bytes were added."]} />;
}

