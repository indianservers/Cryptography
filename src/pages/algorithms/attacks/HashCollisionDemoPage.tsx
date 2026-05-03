import { AlgorithmPageShell } from "../../../components/common/AlgorithmPageShell";

export default function HashCollisionDemoPage() {
  return <AlgorithmPageShell title="Hash Collision Demo" category="Cryptanalysis and Attacks" status="Educational" intro="Use tiny toy hashes to show how collisions arise in small output spaces." inputs={["Message samples","Toy digest bits"]} outputs={["Collision pairs","Birthday estimate"]} visualizers={["Bucket chart","Birthday bound panel"]} notes={["This does not generate real MD5 or SHA collisions."]} />;
}

