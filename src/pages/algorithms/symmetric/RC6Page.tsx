import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RC6Page() {
  return <AlgorithmPageShell title="RC6" category="Symmetric Cryptography" status="Legacy" intro="Extend RC5 into four registers with multiplication-driven rotations." inputs={["128-bit block","Key","Round count"]} outputs={["Cipher block","Register trace"]} visualizers={["A/B/C/D lane view","Rotation schedule"]} notes={["RC6 was an AES finalist but is rarely a default choice today."]} />;
}

