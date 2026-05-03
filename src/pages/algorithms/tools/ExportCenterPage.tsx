import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ExportCenterPage() {
  return <AlgorithmPageShell title="Export Center" category="Export Center" status="Educational" intro="Export current outputs, saved experiments, Markdown explanations, JSON state, and CSV step tables." inputs={["Export type","Scope","Filename"]} outputs={["Download payload","Preview"]} visualizers={["Export format tabs","Saved experiment selector"]} notes={["Review exports before sharing because they may contain keys or plaintext."]} />;
}

