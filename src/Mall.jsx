import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function Mall(props) {
  const model = useGLTF("/mall.glb");
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
      scale={0.18}
      {...props}
    />
  );
}