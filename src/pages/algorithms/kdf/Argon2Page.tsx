import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function Argon2Page() {
  return <AlgorithmPageShell title="Argon2" category="Key Derivation Functions" status="Modern" intro="Compare Argon2d, Argon2i, and Argon2id memory and time costs." inputs={["Password","Salt","Variant","Memory cost","Time cost","Parallelism"]} outputs={["Derived key preview","Cost estimate"]} visualizers={["Memory lane diagram","Pass schedule"]} notes={["A browser implementation normally needs a vetted WASM module."]} />;
}
