// ============================================
// KeyboardThirdPersonMovement.jsx - Physics Version
// ============================================
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function KeyboardThirdPersonMovement({
  moveInput,
  playerRef,
  rigidBodyRef,
  cameraYaw,
  onAnimationStateChange,
  isRunning,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !rigidBodyRef?.current || !moveInput) return;

    // Calculate actual movement intensity
    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Determine speed and animation
    let moveSpeed = 0;
    let animState = "idle";

    if (intensity > 0.1) {
      if (isRunning) {
        // Ctrl is pressed - RUN
        moveSpeed = 14;
        animState = "run";
      } else {
        // No Ctrl - WALK
        moveSpeed = 8;
        animState = "walk";
      }
    }

    onAnimationStateChange(animState);

    if (intensity > 0.1) {
      // Calculate movement direction relative to camera
      const angle = Math.atan2(moveInput.x, -moveInput.y);
      const moveAngle = cameraYaw.current + angle;

      // Apply velocity to physics body (instead of direct position change)
      rigidBodyRef.current.setLinvel({
        x: -Math.sin(moveAngle) * moveSpeed,
        y: rigidBodyRef.current.linvel().y, // Preserve vertical velocity (gravity)
        z: -Math.cos(moveAngle) * moveSpeed,
      });

      // Rotate character to face movement direction using quaternion
      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), moveAngle + Math.PI);
      rigidBodyRef.current.setRotation(quaternion, true);
    } else {
      // Stop movement when no input
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: rigidBodyRef.current.linvel().y, // Keep gravity
        z: 0,
      });
    }
  });

  return null;
}