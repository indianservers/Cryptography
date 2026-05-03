import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RSASmallExponentPage() {
  return <AlgorithmPageShell title="RSA Small Exponent Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Show why raw low-exponent RSA without padding can be dangerous." inputs={["Message integer","e","n"]} outputs={["Cipher integer","Root check"]} visualizers={["m^e size comparison","Padding warning"]} notes={["OAEP prevents this class of raw RSA mistake."]} />;
}

