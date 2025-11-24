import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import City from "./City";
import {
  Character,
  CharacterController,
  CharacterController1,
} from "./Utils/CharacterLoader";
import Sky360 from "./Utils/ImageLoader";
import { useEffect, useState } from "react";
import { Joystick } from "react-joystick-component";

export default function App() {
  // const [deviceType, setDeviceType] = useState("keyboard");

  const handleJoystickMove = (keys) => {
    // You can pass keys down or handle globally
    console.log("Joystick keys:", keys);
  };

  const handleJoystickStop = () => {
    console.log("Joystick released");
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ near: 0.1, far: 100000, position: [20, 15, 20], fov: 45  }}
        gl={{ logarithmicDepthBuffer: true }}
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
        {/* <directionalLight intensity={3}/> */}
        <ambientLight intensity={3} />
        <Physics gravity={[0, -9.81, 0]}>
          <RigidBody type="kinematicPosition" colliders="trimesh">
            {/* <Character/> */}
            <OrbitControls />
          </RigidBody>
          <RigidBody type="fixed" colliders="trimesh">
            <City position={[4, 0.57, 0]} scale={[30, 30, 30]} />
          </RigidBody>
        </Physics>
        {/* <Sky360 /> */}
      </Canvas>
      {/* Joystick overlay outside Canvas */}
      {/* {deviceType === "touch" && ( */}
      <div style={{ position: "absolute", bottom: 50, left: 50 }}>
        <Joystick
          size={100}
          baseColor="rgba(255,255,255,0.3)"
          stickColor="rgba(0,0,0,0.6)"
          move={handleJoystickMove}
          stop={handleJoystickStop}
        />
      </div>
      {/* )} */}
    </div>
  );
}
