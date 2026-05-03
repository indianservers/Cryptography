import { AlgorithmPageShell } from "../../../../components/common/AlgorithmPageShell";

export default function RSAEncryptionPage() {
  return <AlgorithmPageShell title="RSA Encryption" category="Public Key Cryptography" status="Educational" intro="Raise a message integer to e modulo n and inspect square-and-multiply." inputs={["Message","e","n"]} outputs={["Cipher integer","Modular exponent table"]} visualizers={["Binary exponent ladder","m^e mod n trace"]} notes={["Messages must be padded and smaller than n before real RSA encryption."]} />;
}

