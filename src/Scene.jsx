import { Shadow, AccumulativeShadows, RandomizedLight } from "@react-three/drei";

export default function Scene() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, -1, 0]}  
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#dddddd" roughness={0.7} />
      </mesh>

      <AccumulativeShadows
        temporal
        frames={60}
        alphaTest={0.9}
        scale={45}
        position={[0, -1.01, 0]}
        color="black"
        opacity={0.6}
      >
        <RandomizedLight
          amount={8}
          intensity={1}
          radius={10}
          ambient={0.5}
          position={[5, 10, 5]}
          bias={0.001}
        />
      </AccumulativeShadows>

      <Shadow
        position={[0, -1.09, 0]}
        scale={50}
        opacity={0.3}
        blur={2}
        color="black"
      />
    </>
  );
}