import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AESModesPage() {
  return <AlgorithmPageShell title="AES Modes" category="Modes of Operation" status="Modern" intro="Compare how AES block encryption is wrapped by ECB, CBC, CFB, OFB, CTR, and GCM." inputs={["Plaintext blocks","Key","IV or nonce","Mode"]} outputs={["Block flow output","Authentication tag when available"]} visualizers={["Mode flow diagram","Nonce and IV rules","Repeated block detector"]} notes={["Never reuse a nonce with GCM or CTR under the same key."]} />;
}

