import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Argon2Page() {
  return <AlgorithmPageShell title="Argon2" category="Key Derivation Functions" status="Modern" intro="Conceptual preview of Argon2d, Argon2i, and Argon2id memory and time costs; this page does not produce a production Argon2 hash." inputs={["Demo password","Demo salt","Variant","Memory cost","Time cost","Parallelism"]} outputs={["Parameter summary","Memory/time estimate"]} visualizers={["Memory lane diagram","Pass schedule"]} notes={["Browser-native Web Crypto does not provide Argon2; exact hashes require a vetted WASM module and official vectors."]} />;
}
