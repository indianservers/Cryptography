import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SavedExperimentsPage() {
  return <AlgorithmPageShell title="Saved Experiments" category="Saved Experiments" status="Educational" intro="Browse experiments saved locally in IndexedDB and export or delete them." inputs={["Algorithm filter","Search saved title"]} outputs={["Experiment list","Selected JSON"]} visualizers={["IndexedDB table","Export controls"]} notes={["Saved data stays in this browser profile unless exported."]} />;
}

