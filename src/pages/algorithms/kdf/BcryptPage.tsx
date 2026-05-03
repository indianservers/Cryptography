import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BcryptPage() {
  return <AlgorithmPageShell title="bcrypt" category="Key Derivation Functions" status="Legacy" intro="Inspect bcrypt's cost parameter and salt-bearing password hash format." inputs={["Password","Cost","Salt"]} outputs={["Hash format","Work factor estimate"]} visualizers={["EksBlowfish setup","Cost doubling chart"]} notes={["bcrypt is still common, but Argon2id is preferred for new password storage."]} />;
}

