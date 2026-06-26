import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AESModesPage() {
  return <AlgorithmPageShell title="AES Modes" category="Modes of Operation" status="Modern" intro="Conceptual comparison of ECB, CBC, CFB, OFB, CTR, and GCM mode structure; exact encryption is only claimed on separately tested Web Crypto pages." inputs={["Plaintext block concepts","Demo key","IV or nonce concept","Mode"]} outputs={["Block flow concept","Authentication tag concept"]} visualizers={["Mode flow diagram","Nonce and IV rules","Repeated block detector"]} notes={["Never reuse a nonce with GCM or CTR under the same key; ECB leaks repeated blocks."]} />;
}
