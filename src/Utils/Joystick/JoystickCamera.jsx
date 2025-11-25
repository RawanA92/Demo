
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { usePlayerMovement } from "./usePlayerMovement";

export default function JoystickCameraController({
  targetRef,
  radius = 10,
  lerpSpeed = 0.1,
  rotationSpeed = 0.05  // Adjust this for faster/slower rotation
}) {
  const desiredPos = useRef(new THREE.Vector3());
  const lookAtVec = useRef(new THREE.Vector3());

  // Persistent rotation angles
  const yaw = useRef(Math.PI);
  const pitch = useRef(0);
  
  // Track previous input to detect movement
  const prevInput = useRef({ x: 0, y: 0 });

  const camMove = usePlayerMovement((s) => s.cam) || { x: 0, y: 0 };

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    const pos = typeof targetRef.current.translation === "function"
      ? targetRef.current.translation()
      : targetRef.current.position;
    if (!pos) return;

    // FIXED: Only update rotation when joystick is actively moved
    // Use delta time for frame-rate independent movement
    const inputStrength = Math.sqrt(camMove.x * camMove.x + camMove.y * camMove.y);
    
    if (inputStrength > 0.1) {  // Dead zone threshold
      yaw.current -= camMove.x * rotationSpeed * (delta * 60);  // Normalized to 60fps
      pitch.current -= camMove.y * rotationSpeed * (delta * 60);
      pitch.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch.current));
    }

    // Calculate camera position using spherical coordinates
    const x = radius * Math.cos(pitch.current) * Math.sin(yaw.current);
    const y = radius * Math.sin(pitch.current);
    const z = radius * Math.cos(pitch.current) * Math.cos(yaw.current);

    desiredPos.current.set(pos.x + x, pos.y + y, pos.z + z);

    // Smooth camera movement
    state.camera.position.lerp(desiredPos.current, lerpSpeed);

    // Look at target
    lookAtVec.current.set(pos.x, pos.y, pos.z);
    state.camera.lookAt(lookAtVec.current);
    
    prevInput.current = { x: camMove.x, y: camMove.y };
  });

  return null;
}
