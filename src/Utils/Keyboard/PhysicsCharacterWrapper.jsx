import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

export default function PhysicsCharacterWrapper({ 
  playerRef, 
  moveInput, 
  isRunning,
  children 
}) {
  const rigidBodyRef = useRef();

  // Sync the physics body position with the playerRef
  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !playerRef.current) return;

    // Get current physics body position
    const physicsPos = rigidBodyRef.current.translation();
    
    // Update playerRef position to match physics body
    playerRef.current.position.set(
      physicsPos.x,
      physicsPos.y,
      physicsPos.z
    );

    // Apply movement through physics
    if (moveInput && (Math.abs(moveInput.x) > 0.1 || Math.abs(moveInput.y) > 0.1)) {
      const speed = isRunning ? 14 : 8;
      
      // Calculate movement direction (you'll need to pass cameraYaw if needed)
      const dir = {
        x: moveInput.x * speed,
        z: -moveInput.y * speed
      };

      rigidBodyRef.current.setLinvel({
        x: dir.x,
        y: rigidBodyRef.current.linvel().y, // preserve gravity
        z: dir.z,
      });
    } else {
      // Stop horizontal movement when no input
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: rigidBodyRef.current.linvel().y,
        z: 0,
      });
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders={false}
      position={[0, 1, 0]}
      lockRotations
      canSleep={false}
    >
      <CapsuleCollider args={[0.1, 0.9]} position={[0, 1, 0]} />
      {children}
    </RigidBody>
  );
}