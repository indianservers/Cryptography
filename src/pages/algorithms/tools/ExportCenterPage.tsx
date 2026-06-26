import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ExportCenterPage() {
  return <AlgorithmPageShell title="Export Center" category="Export Center" status="Educational" intro="Conceptual export preview for learning artifacts; review and redact anything that may contain plaintext, keys, passwords, tokens, or secrets." inputs={["Export type","Scope","Filename"]} outputs={["Download payload concept","Preview"]} visualizers={["Export format tabs","Saved experiment selector"]} notes={["Review exports before sharing because they may contain keys, plaintext, or other sensitive data."]} />;
}
