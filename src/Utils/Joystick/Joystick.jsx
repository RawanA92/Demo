import { useFrame } from "@react-three/fiber";
import { Joystick } from "react-joystick-component";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
// ============ JoystickGUI Component ============
export function CharacterModel({ playerRef }) {
  const { scene } = useGLTF("/character1.glb");

  useFrame(() => {
    if (playerRef.current && scene) {
      // Sync model position and rotation with player
      scene.position.copy(playerRef.current.position);
      scene.rotation.copy(playerRef.current.rotation);
    }
  });

  return (
    <primitive
      object={scene}
      scale={3}
      // REMOVE position prop - let it follow playerRef dynamically
      castShadow
      receiveShadow
    />
  );
}

export function JoystickGUI({ onMoveChange, onLookChange }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* Movement Joystick (Left) */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          pointerEvents: "auto",
        }}
      >
        <Joystick
          size={100}
          sticky={false}
          baseColor="rgba(255, 255, 255, 0.3)"
          stickColor="rgba(255, 255, 255, 0.8)"
          move={(data) => onMoveChange({ x: data.x || 0, y: data.y || 0 })}
          stop={() => onMoveChange({ x: 0, y: 0 })}
        />
        <p
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 5,
            fontSize: 12,
            fontFamily: "system-ui",
          }}
        >
          Move
        </p>
      </div>

      {/* Look Joystick (Right) */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          pointerEvents: "auto",
        }}
      >
        <Joystick
          size={100}
          sticky={false}
          baseColor="rgba(255, 255, 255, 0.3)"
          stickColor="rgba(255, 255, 255, 0.8)"
          move={(data) => onLookChange({ x: data.x || 0, y: data.y || 0 })}
          stop={() => onLookChange({ x: 0, y: 0 })}
        />
        <p
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 5,
            fontSize: 12,
            fontFamily: "system-ui",
          }}
        >
          Look
        </p>
      </div>
    </div>
  );
}

// ============ JoystickFirstPersonMovement Component ============
export function JoystickFirstPersonMovement({ moveInput, yaw, playerRef }) {
  useFrame((state, delta) => {
    if (!playerRef.current || !moveInput) return;

    const moveSpeed = 5;
    const moveVector = new THREE.Vector3();

    // Forward/backward (joystick Y axis)
    moveVector.z = -moveInput.y * moveSpeed * delta;

    // Strafe left/right (joystick X axis)
    moveVector.x = moveInput.x * moveSpeed * delta;

    // Apply movement relative to camera's yaw rotation
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    playerRef.current.position.add(moveVector);

    // Character always faces the camera direction
    playerRef.current.rotation.y = yaw.current;
  });

  return null;
}

// ============ JoystickFirstPersonCamera Component ============
export function JoystickFirstPersonCamera({
  lookInput,
  playerRef,
  yaw,
  pitch,
}) {
  useFrame((state, delta) => {
    if (!playerRef.current || !lookInput) return;

    // Update rotation based on look joystick (orbital rotation)
    const lookSensitivity = 2.0;
    yaw.current -= lookInput.x * lookSensitivity * delta;
    pitch.current += lookInput.y * lookSensitivity * delta;

    // Clamp pitch for better view
    pitch.current = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, pitch.current)
    );

    // Orbital camera: position camera in a circle around character
    const orbitRadius = 3; // Distance from character
    const orbitHeight = 3; // Height above character

    // Calculate camera position using spherical coordinates
    const camX =
      playerRef.current.position.x + orbitRadius * Math.sin(yaw.current);
    const camY = playerRef.current.position.y + orbitHeight + pitch.current * 2;
    const camZ =
      playerRef.current.position.z + orbitRadius * Math.cos(yaw.current);

    // Set camera position
    state.camera.position.set(camX, camY, camZ);

    // Always look at the character
    state.camera.lookAt(
      playerRef.current.position.x,
      playerRef.current.position.y + 4.5, // Look at character center
      playerRef.current.position.z
    );
  });

  return null;
}
