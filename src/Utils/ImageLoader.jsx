import { useTexture } from "@react-three/drei";
import * as THREE from 'three'
import { useThree } from "@react-three/fiber";
export default function Sky360() {
  const texture = useTexture("/p5.jpg")
  texture.mapping = THREE.EquirectangularReflectionMapping

  const { scene } = useThree()
  scene.background = texture  // renders as a 360° panorama

  return null
}