import { HashIODemoPage } from "./HashIODemoPage";

export default function SHA1IODemoPage() {
  return <HashIODemoPage title="SHA-1 Input / Output" algorithm="SHA-1" status="Deprecated" note="SHA-1 is deprecated for collision-sensitive use. Prefer SHA-256 or SHA-512." />;
}
