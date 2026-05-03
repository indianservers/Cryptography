import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RC5Page() {
  return <AlgorithmPageShell title="RC5" category="Symmetric Cryptography" status="Legacy" intro="Study a parameterized cipher built from data-dependent rotations." inputs={["Word size","Rounds","Key"]} outputs={["Cipher words","Rotation trace"]} visualizers={["ARX operation panel","Round word table"]} notes={["Parameter choices matter; small round counts are educational only."]} />;
}

