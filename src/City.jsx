import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function City(props) {
  const model = useGLTF("/city.glb");
  const { scene } = useThree();

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [model, scene]);

  return (
    <primitive
      object={model.scene}
      castShadow
      receiveShadow
      scale={3}
      {...props}
    />
  );
}