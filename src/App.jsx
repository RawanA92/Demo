import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CharacterController from "./Utils/CharacterLoader";

function Scene() {
  return (
    <>
      {/* Add 3D objects here later */}
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />
    </>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        style={{ width: "100vw", height: "100vh", backgroundColor: 'green' }}
      >
        <CharacterController/>
        <Scene />
        <gridHelper args={[60, 60, 'blue', 'blue']}/>
      </Canvas>
    </>
  );
}
