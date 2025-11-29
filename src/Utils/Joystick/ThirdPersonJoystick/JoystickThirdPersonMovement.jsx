import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function JoystickThirdPersonMovement({
  moveInput,
  playerRef,
  cameraYaw,
  onAnimationStateChange,
}) {
  const currentAnimState = useRef("idle");

  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    // Clamp delta to prevent large jumps during frame drops
    const clampedDelta = Math.min(delta, 0.1);

    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    // Determine speed and animation based on intensity
    let moveSpeed = 0;
    let animState = "idle"; // Default to idle

    if (intensity > 0.8) {
      moveSpeed = 14;
      animState = "run";
    } else if (intensity > 0.1) {
      moveSpeed = 8;
      animState = "walk";
    }

    // Only update animation state if it changed (reduces unnecessary updates)
    if (currentAnimState.current !== animState) {
      currentAnimState.current = animState;
      onAnimationStateChange(animState);
    }

    if (intensity > 0.1) {
      // Calculate movement direction relative to camera (inverted forward/backward)
      const angle = Math.atan2(moveInput.x, -moveInput.y); // Negated moveInput.y
      const moveAngle = cameraYaw.current + angle;

      // Move character with clamped delta
      const moveVector = new THREE.Vector3(
        -Math.sin(moveAngle) * moveSpeed * clampedDelta,
        0,
        -Math.cos(moveAngle) * moveSpeed * clampedDelta
      );

      playerRef.current.position.add(moveVector);

      // Rotate character to face movement direction with proper angle wrapping
      const targetRotation = moveAngle + Math.PI;
      const currentRotation = playerRef.current.rotation.y;
      
      // Calculate shortest rotation path
      let rotationDiff = targetRotation - currentRotation;
      
      // Wrap the difference to [-π, π] range
      while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
      while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
      
      // Apply smoothed rotation
      playerRef.current.rotation.y = currentRotation + rotationDiff * 0.15;
    }

    // Keep character grounded INSIDE useFrame
    playerRef.current.position.y = -14;
  });

  return null;
}