import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function DESKeySchedulePage() {
  return <AlgorithmPageShell title="DES Key Schedule" category="Block Ciphers" status="Deprecated" intro="Generate the 16 DES round keys with PC-1, left shifts, and PC-2." inputs={["64-bit key","Round selector"]} outputs={["C and D halves","48-bit round keys"]} visualizers={["PC-1 permutation","Shift schedule","PC-2 table"]} notes={["Parity bits are dropped; the effective DES key length is 56 bits."]} />;
}

