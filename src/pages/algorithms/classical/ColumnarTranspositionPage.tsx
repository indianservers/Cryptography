import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function ColumnarTranspositionPage() {
  return <AlgorithmPageShell title="Columnar Transposition" category="Classical Cryptography" status="Educational" intro="Place text in columns under a keyword and read columns by sorted key order." inputs={["Plaintext","Keyword","Padding character"]} outputs={["Ciphertext","Column read order"]} visualizers={["Column grid","Keyword ordering table"]} notes={["Repeated keyword letters need a stable tie-breaking rule."]} />;
}

