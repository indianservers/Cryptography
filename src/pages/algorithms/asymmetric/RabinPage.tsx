import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function RabinPage() {
  return <AlgorithmPageShell title="Rabin Cryptosystem" category="Public Key Cryptography" status="Educational" intro="Square a message modulo n and recover four square roots during decryption." inputs={["p","q","message"]} outputs={["Cipher square","Candidate roots"]} visualizers={["Modulo square map","CRT recombination"]} notes={["Rabin needs redundancy or padding to identify the correct plaintext."]} />;
}

