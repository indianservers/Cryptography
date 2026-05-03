import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function PlayfairCipherPage() {
  return <AlgorithmPageShell title="Playfair Cipher" category="Classical Cryptography" status="Educational" intro="Encrypt digraphs using a 5x5 keyword square and row, column, or rectangle rules." inputs={["Keyword","Plaintext digraphs","I/J merge"]} outputs={["Cipher digraphs","Prepared pairs"]} visualizers={["5x5 matrix","Digraph preparation","Rule table"]} notes={["Inserted filler letters alter the message shape and must be handled consistently."]} />;
}

