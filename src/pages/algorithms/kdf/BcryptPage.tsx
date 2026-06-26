import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BcryptPage() {
  return <AlgorithmPageShell title="bcrypt" category="Key Derivation Functions" status="Legacy" intro="Conceptual preview of bcrypt cost and salt-bearing hash format; this page is not a production bcrypt implementation." inputs={["Demo password","Cost","Demo salt"]} outputs={["Format outline","Work factor estimate"]} visualizers={["EksBlowfish setup concept","Cost doubling chart"]} notes={["Exact bcrypt output requires a vetted implementation and vectors; Argon2id is preferred for new password storage."]} />;
}
