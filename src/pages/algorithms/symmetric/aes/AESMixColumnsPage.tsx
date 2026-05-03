import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function AESMixColumnsPage() {
  return <AlgorithmPageShell title="AES MixColumns" category="Block Ciphers" status="Educational" intro="Multiply each AES state column by the Rijndael matrix in GF(2^8)." inputs={["State column bytes"]} outputs={["Mixed column","GF products"]} visualizers={["Column matrix","Finite-field multiplication table"]} notes={["MixColumns diffuses one byte change across a full column."]} />;
}

