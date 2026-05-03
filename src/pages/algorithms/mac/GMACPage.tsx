import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function GMACPage() {
  return <AlgorithmPageShell title="GMAC" category="MAC Algorithms" status="Modern" intro="Use the GCM authentication function without encrypting plaintext." inputs={["AES key","IV","AAD"]} outputs={["Authentication tag","GHASH state"]} visualizers={["GHASH multiplication","Counter tag mask"]} notes={["IV uniqueness under a key remains required."]} />;
}

