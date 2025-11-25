import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import City from "./City";
import { Character } from "./Utils/CharacterLoader";
import { useDeviceType } from "./Utils/DeviceType";
import { CharacterJoystick } from "./Utils/Joystick";
import JoystickCharacter from "./Utils/JoystickLoader";
import { useState } from "react";
import { Joystick } from "react-joystick-component";
export default function App() {

  const [joystickVector, setJoystickVector] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    setJoystickVector({ x: event.x, y: event.y });
  };

  const handleStop = () => {
    setJoystickVector({ x: 0, y: 0 });
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ near: 0.1, far: 1000, position: [20, 15, 20], fov: 45 }}
        // gl={{ logarithmicDepthBuffer: true }}
      >
        <Environment preset="sunset" />
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
        <ambientLight intensity={3} />
        <Physics gravity={[0, -9.81, 0]}>
          {useDeviceType() === "touch" ? <CharacterJoystick/> : <Character/>}
          {/* <JoystickCharacter joystickVector={joystickVector}/> */}
          <OrbitControls />
          <City position={[4, -12.8, 0]} scale={[1, 1, 1]} />
        </Physics>
      </Canvas>
      {/* )} */}
    </div>
  );
}
