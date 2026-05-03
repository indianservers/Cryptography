import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function BigIntegerConverterPage() {
  return <AlgorithmPageShell title="Big Integer Converter" category="Encoding Tools" status="Educational" intro="Convert large integers among decimal, hex, binary, and Base64 byte forms." inputs={["Integer input","Input base","Endian option"]} outputs={["Converted values","Byte length"]} visualizers={["Base conversion table","Endian byte viewer"]} notes={["Leading zeros matter when integers represent fixed-width keys."]} />;
}

