import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function CMACPage() {
  return <AlgorithmPageShell title="CMAC" category="MAC Algorithms" status="Modern" intro="Authenticate blocks using AES-CMAC subkeys and final-block processing." inputs={["AES key","Message"]} outputs={["K1/K2 subkeys","CMAC tag"]} visualizers={["Subkey generation","Block chaining","Final block rule"]} notes={["CMAC requires a block cipher key used for authentication only."]} />;
}

