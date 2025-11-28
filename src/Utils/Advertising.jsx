import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function AdvertisingPlane(props) {
  const texture = useLoader(THREE.TextureLoader, props.advertisementImage);

  return (
    <mesh position={props.position} rotation={props.rotation}>
      <planeGeometry args={props.args} /> {/* width, height */}
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
