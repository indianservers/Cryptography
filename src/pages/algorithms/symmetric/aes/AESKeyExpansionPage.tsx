import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AESKeyExpansionPage() {
  return <AlgorithmPageShell title="AES Key Expansion" category="Block Ciphers" status="Educational" intro="Follow RotWord, SubWord, Rcon, and XOR operations that create AES round keys." inputs={["AES key","Key size"]} outputs={["Round keys","Word table"]} visualizers={["Expansion word ledger","Rcon timeline"]} notes={["Round keys are derived secrets and should not be logged in production."]} />;
}

