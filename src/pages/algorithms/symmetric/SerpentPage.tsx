import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function SerpentPage() {
  return <AlgorithmPageShell title="Serpent" category="Symmetric Cryptography" status="Modern" intro="Visualize the conservative AES finalist with 32 S-box based rounds." inputs={["Plaintext block","Key size"]} outputs={["Cipher block","Round state"]} visualizers={["Bitslice S-box lane","Linear transform"]} notes={["Serpent favors a high security margin over raw speed."]} />;
}

