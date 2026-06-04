import { HashIODemoPage } from "./HashIODemoPage";

export default function MD5IODemoPage() {
  return <HashIODemoPage title="MD5 Input / Output" algorithm="MD5" status="Unsafe" note="MD5 is broken for collision resistance and should not protect modern systems." />;
}
