// JoystickCharacterController.jsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { usePlayerMovement } from "./usePlayerMovement";
import JoystickCameraController from "./JoystickCamera";

export default function JoystickCharacterController() {
  const ref = useRef();
  const { scene, animations } = useGLTF("/character1.glb");

  // Filter missing animation tracks
  animations.forEach((clip) => {
    clip.tracks = clip.tracks.filter((track) =>
      scene.getObjectByName(track.name.split(".")[0])
    );
  });

  const { actions, mixer } = useAnimations(animations, ref);
  const currentAction = useRef(null);

  // Movement vector from store
  const move = usePlayerMovement((s) => s.move);

  // Smooth animation switching
  const playAction = (name, fade = 0.2) => {
    const next = actions[name];
    if (!next || currentAction.current === next) return;

    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.fadeIn(fade).play();

    if (currentAction.current) currentAction.current.fadeOut(fade);
    currentAction.current = next;
  };

  // Start idle
  useEffect(() => {
    if (actions["Idle"]) playAction("Idle", 0);
  }, [actions]);

  // Movement loop
  useFrame((_, delta) => {
    if (!ref.current) return;
    const body = ref.current;
    const speed = 5;

    const vec = new THREE.Vector3(move.x, 0, move.z);
    const intensity = vec.length();

    if (intensity > 0.001) {
      vec.normalize();

      const rot = Math.atan2(vec.x, vec.z);
      body.setRotation({ x: 0, y: rot, z: 0 }, true);

      const pos = body.translation();
      body.setTranslation(
        {
          x: pos.x + vec.x * speed * intensity * delta,
          y: pos.y,
          z: pos.z + vec.z * speed * intensity * delta,
        },
        true
      );

      if (intensity > 0.8 && actions["Run"]) playAction("Run");
      else if (intensity > 0.1 && actions["Walk"]) playAction("Walk");
      else if (actions["Run"]) playAction("Run");
    } else {
      playAction("Idle");
    }

    if (currentAction.current) {
      currentAction.current.timeScale = vec.z >= 0 ? 1 : -1;
    }
  });

  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  return (
    <>
      <RigidBody ref={ref} type="kinematicPosition">
        <primitive
          object={scene}
          scale={3}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        />
      </RigidBody>

      {/* Orbit camera controlled by joystick */}
      <JoystickCameraController
        targetRef={ref}
        radius={12}      // distance from character
        lerpSpeed={0.12} // smoothness
      />
    </>
  );
}
