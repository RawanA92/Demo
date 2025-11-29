import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";

export default function AdvertisingPlane(props) {
  const texture = useLoader(THREE.TextureLoader, props.advertisementImage);
  const [hovered, setHovered] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    
    if (props.url) {
      // Open website URL in new tab
      window.open(props.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <mesh
      position={props.position}
      rotation={props.rotation}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      <planeGeometry args={props.args} /> {/* width, height */}
      <meshBasicMaterial
        map={texture}
        // transparent
        // opacity={hovered ? 0.9 : 1}
      />
    </mesh>
  );
}