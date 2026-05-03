import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function RSADecryptionPage() {
  return <AlgorithmPageShell title="RSA Decryption" category="Public Key Cryptography" status="Educational" intro="Recover m = c^d mod n and compare direct and CRT-style thinking." inputs={["Cipher integer","private exponent d","modulus n"]} outputs={["Recovered message integer","Exponentiation table"]} visualizers={["Square-and-multiply trace","CRT concept panel"]} notes={["Private exponent operations must be protected against timing leaks."]} />;
}

