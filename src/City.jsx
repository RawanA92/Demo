import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function City(props) {
  const { onObjectClick, ...otherProps } = props;
  const city = useGLTF("/city.glb");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const models = [
    {
      file: useGLTF("/address_mall.glb"),
      position: [100, -1, -120],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.8, 0.8, 0.8],
      name: "Address Mall"
    },
    {
      file: useGLTF("/skyscraper (1).glb"),
      position: [130, -1, -60],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.9, 0.3, 0.9],
      name: "Skyscraper 1"
    },
    {
      file: useGLTF("/al_faisaliyah_center_riyadh.glb"),
      position: [0, 0, -175],
      rotation: [0, 0, 0],
      scale: [0.008, 0.008, 0.008],
      name: "Al Faisaliyah Center"
    },
    {
      file: useGLTF("/albaik_restaurant.glb"),
      position: [-100, -1.1, -40],
      rotation: [0, -Math.PI / 2, 0],
      scale: [6, 6, 6],
      name: "Albaik Restaurant"
    },
    {
      file: useGLTF("/bicycle_parking.glb"),
      position: [-60, -1.1, -40],
      rotation: [0, -Math.PI / 2, 0],
      scale: [7, 4, 4],
      name: "Bicycle Parking"
    },
    {
      file: useGLTF("/metal_billboard_advertising_single_sided_free.glb"),
      position: [-40, -1.1, -40],
      rotation: [0, -Math.PI / 3, 0],
      scale: [4, 4, 4],
      name: "Billboard"
    },
    {
      file: useGLTF("/gas-station2.glb"),
      position: [-60, -1.1, -100],
      rotation: [0, Math.PI / 2, 0],
      scale: [1.5, 1.5, 1.5],
      name: "Gas Station"
    },
    {
      file: useGLTF("/ferrari.glb"),
      position: [-68, -1.1, -110],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      name: "Ferrari Car"
    },
    {
      file: useGLTF("/saudi__tower.glb"),
      position: [-30, 48.5, 105],
      rotation: [0, Math.PI / 2, 0],
      scale: [19, 19, 19],
      name: "Saudi Tower"
    },
    {
      file: useGLTF("/modern_building_002.glb"),
      position: [-38, -1.3, 45],
      rotation: [0, Math.PI / 2 , 0],
      scale: [0.3, 0.3, 0.3],
      name: "Modern Building"
    },
    {
      file: useGLTF("/skyscraper.glb"),
      position: [70, -2.5, 120],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.9, 0.9, 0.9],
      name: "Skyscraper"
    },
    {
      file: useGLTF("/skyscraper_tower.glb"),
      position: [40, -2.5, 45],
      rotation: [0, Math.PI / 2, 0],
      scale: [0.85, 0.85, 0.85],
      name: "Skyscraper Tower"
    },
  ];

  useEffect(() => {
    const applyShadowsAndClick = (model, modelName) => {
      model.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          child.addEventListener('click', (event) => {
            event.stopPropagation();
            const worldPosition = child.getWorldPosition(new THREE.Vector3());
            console.log(`النقر على: ${modelName}`, worldPosition);
            
            if (onObjectClick) {
              onObjectClick([worldPosition.x, worldPosition.y, worldPosition.z], modelName);
            }
          });
          
          child.cursor = 'pointer';
        }
      });
    };

    applyShadowsAndClick(city, "City Base");
    models.forEach((m) => applyShadowsAndClick(m.file, m.name));

  }, [city, models, onObjectClick]);

  const handleCityClick = (event) => {
    event.stopPropagation();
    const point = event.point;
    console.log('click', point);
    
    if (onObjectClick) {
      onObjectClick([point.x, point.y, point.z], "City Ground");
    }
  };

  const handleModelClick = (event, modelName) => {
    event.stopPropagation();
    const point = event.point;
    console.log(`click ${modelName}:`, point);
    
    if (onObjectClick) {
      onObjectClick([point.x, point.y, point.z], modelName);
    }
  };

  return (
    <group {...otherProps}>
      <primitive 
        object={city.scene} 
        scale={3} 
        castShadow 
        receiveShadow 
        onClick={handleCityClick}
      />

      {models.map((m, i) => (
        <primitive
          key={i}
          object={m.file.scene}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
          castShadow
          receiveShadow
          onClick={(event) => handleModelClick(event, m.name)}
        />
      ))}
    </group>
  );
}