import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import City from "./City";
import Mall from "./Mall";
import Scene from "./Scene";
import CharacterController from "./Utils/CharacterLoader";
import { Physics, RigidBody } from "@react-three/rapier";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [20, 15, 20], fov: 45 }}>
        <Physics gravity={[0, -9.81, 0]}>
          {/* LIGHTS */}
          <directionalLight
  castShadow
  intensity={2.5}
  position={[50, 120, 50]}
  shadow-mapSize-width={8192}  
  shadow-mapSize-height={8192}
  shadow-bias={-0.0005}       
  shadow-normalBias={0.05}     
  shadow-camera-far={500}
  shadow-camera-left={-400}
  shadow-camera-right={400}
  shadow-camera-top={400}
  shadow-camera-bottom={-400}
/>

          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, 5, -10]} intensity={0.3} />

          {/* ENVIRONMENT */}
          <Environment preset="sunset" />

          {/* PLAYER CONTROLLER – NOT inside RigidBody */}
          <CharacterController start={[0, 0, 0]} />

          {/* CITY COLLIDER */}
          <RigidBody type="fixed" colliders="trimesh">
            <City position={[4, 0.57, 0]} scale={[30, 30, 30]} />
          </RigidBody>
          {/* <OrbitControls/> */}
          {/* OPTIONAL */}
          {/* <Mall position={[-38, -1, 2]} /> */}

          <Scene />
        </Physics>
      </Canvas>
    </div>
  );
}
