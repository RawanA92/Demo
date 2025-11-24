import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function City(props) {
  const city = useGLTF("/city.glb");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const models = [
    {
      file: useGLTF("/address_mall.glb"),
      position: [100, 0, -120],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.8, 0.8, 0.8],
    },
    {
      file: useGLTF("/skyscraper (1).glb"),
      position: [130, 0, -60],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.9, 0.3, 0.9],
    },
    {
      file: useGLTF("/al_faisaliyah_center_riyadh.glb"),
      position: [0, 0, -175],
      rotation: [0, 0, 0],
      scale: [0.008, 0.008, 0.008],
    },
    {
      file: useGLTF("/albaik_restaurant.glb"),
      position: [-100, -1.1, -40],
      rotation: [0, -Math.PI / 2, 0],
      scale: [6, 6, 6],
    },
    {
      file: useGLTF("/bicycle_parking.glb"),
      position: [-60, -1.1, -40],
      rotation: [0, -Math.PI / 2, 0],
      scale: [6, 6, 6],
    },
    {
      file: useGLTF("/metal_billboard_advertising_single_sided_free.glb"),
      position: [-40, -1.1, -40],
      rotation: [0, -Math.PI / 3, 0],
      scale: [4, 4, 4],
    },
    {
      file: useGLTF("/gas-station2.glb"),
      position: [-60, -1.1, -100],
      rotation: [0, Math.PI / 2, 0],
      scale: [1.5, 1.5, 1.5],
    },
    {
      file: useGLTF("/ferrari.glb"),
      position: [-68, -1.1, -110],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
    },
    {
      file: useGLTF("/saudi__tower.glb"),
      position: [-30, 48.5, 105],
      rotation: [0, Math.PI / 2, 0],
      scale: [19, 19, 19],
    },
    {
      file: useGLTF("/modern_building_002.glb"),
      position: [-38, -1.3, 45],
      rotation: [0, Math.PI / 2 , 0],
      scale: [0.3, 0.3, 0.3],
    },
    {
      file: useGLTF("/skyscraper.glb"),
      position: [70, -2.5, 120],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.9, 0.9, 0.9],
    },
    {
      file: useGLTF("/skyscraper_tower.glb"),
      position: [40, -2.5, 45],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.85, 0.85, 0.85],
    },
  ];

  useEffect(() => {
    const applyShadows = (model) => {
      model.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    applyShadows(city);
    models.forEach((m) => applyShadows(m.file));

  }, [city, models]);

  return (
    <group {...props}>
      <primitive object={city.scene} scale={3} castShadow receiveShadow />

      {models.map((m, i) => (
        <primitive
          key={i}
          object={m.file.scene}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
