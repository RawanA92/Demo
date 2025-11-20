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
        scale={120}  
        position={[0, -1.01, 0]}
        color="black"
        opacity={0.6}
      >
        <RandomizedLight
          amount={8}
          intensity={1}
          radius={30}  
          ambient={0.5}
          position={[50, 120, 50]}  
          bias={0.001}
        />
      </AccumulativeShadows>

      <Shadow
        position={[0, -15, 0]}  
        scale={120}  
        opacity={0.5}  
        blur={3}  
        color="black"
      />
    </>
  );
}
