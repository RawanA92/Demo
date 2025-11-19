import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import City from "./City";
import Mall from "./Mall";
import Scene from "./Scene";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [20, 15, 20], fov: 45 }}
      >

        <directionalLight
          castShadow
          intensity={2.5}
          position={[10, 25, 10]}
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-bias={-0.0001}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <ambientLight intensity={0.4} />
        
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, 5, -10]} intensity={0.3} />

        <Environment preset="sunset" />

        <City position={[4, 0.57, 0]} />
        {/* <Mall position={[-38, -1, 2]} /> */}

        <Scene />

        <OrbitControls />
      </Canvas>
    </div>
  );
}