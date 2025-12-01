// KeyboardThirdPersonMovement.jsx (UPDATED - Better movement physics)
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
    if (!rigidBodyRef.current || !moveInput) return;

    const rb = rigidBodyRef.current;

    const intensity = Math.sqrt(
      moveInput.x * moveInput.x + moveInput.y * moveInput.y
    );

    let moveSpeed = 0;
    let animState = "idle";

    if (intensity > 0.1) {
      if (isRunning) {
        moveSpeed = 8; // Reduced for better collision response
        animState = "run";
      } else {
        moveSpeed = 5; // Reduced for better collision response
        animState = "walk";
      }
    }

    onAnimationStateChange(animState);

    const currentVel = rb.linvel();

    if (intensity > 0.1) {
      const angle = Math.atan2(moveInput.x, -moveInput.y);
      const moveAngle = cameraYaw.current + angle;

      // FIXED: Only set horizontal velocity, preserve Y for gravity
      const velocityX = -Math.sin(moveAngle) * moveSpeed;
      const velocityZ = -Math.cos(moveAngle) * moveSpeed;

      // Keep vertical velocity for gravity and jumping
      rb.setLinvel({ 
        x: velocityX, 
        y: currentVel.y, // IMPORTANT: Don't override Y velocity
        z: velocityZ 
      }, true);

      // Smooth rotation towards movement direction
      const targetRotation = new THREE.Quaternion();
      targetRotation.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        moveAngle + Math.PI
      );
      
      const currentRot = rb.rotation();
      const currentQuat = new THREE.Quaternion(
        currentRot.x, 
        currentRot.y, 
        currentRot.z, 
        currentRot.w
      );
      
      // Smooth interpolation
      currentQuat.slerp(targetRotation, 10 * delta);
      rb.setRotation(currentQuat, true);
    } else {
      // Stop horizontal movement but keep gravity
      rb.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
    }

    // Sync playerRef with RigidBody position
    if (playerRef.current) {
      const pos = rb.translation();
      playerRef.current.position.set(pos.x, pos.y, pos.z);
      
      const rot = rb.rotation();
      playerRef.current.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    }
  });

  return null;
}