import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function DESKeySchedulePage() {
  return <AlgorithmPageShell title="DES Key Schedule" category="Block Ciphers" status="Deprecated" intro="Educational DES key-schedule structure preview using PC-1, left shifts, and PC-2; exact subkey vectors are still required before an exact claim." inputs={["64-bit demo key","Round selector"]} outputs={["C and D halves concept","48-bit round key concept"]} visualizers={["PC-1 permutation","Shift schedule","PC-2 table"]} notes={["DES is deprecated. Parity bits are dropped; the effective DES key length is 56 bits."]} />;
}
