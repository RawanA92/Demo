import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { checkCollision, CollisionDebugView } from "./CollisionZones";

export function CharacterControllerWithCollision({ scaleR }) {
  const [cameraHigh, setCameraHigh] = useState(25);
  const { scene, animations } = useGLTF("/character1.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const currentAction = useRef(null);

  const CHARACTER_RADIUS = 2;

  const keys = useRef({});
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const playAction = (name, fadeDuration = 0.2) => {
    const next = actions[name];
    if (!next) return;
    if (currentAction.current === next) return;

    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.fadeIn(fadeDuration).play();

    if (currentAction.current) {
      currentAction.current.fadeOut(fadeDuration);
    }
    currentAction.current = next;
  };

  useEffect(() => {
    if (actions["Idle"]) {
      playAction("Idle", 0.2);
    }
  }, [actions]);

  useFrame((_, delta) => {
    if (!characterRef.current) return;

    const forward = keys.current["w"] || keys.current["arrowup"];
    const backward = keys.current["s"] || keys.current["arrowdown"];
    const left = keys.current["a"] || keys.current["arrowleft"];
    const right = keys.current["d"] || keys.current["arrowright"];
    const ctrl = keys.current["control"];

    let speed = 3;

    if (forward || backward) {
      if (ctrl) {
        speed = 16;
        playAction("Run");
      } else {
        speed = 6;
        playAction("Walk");
      }

      if (currentAction.current) {
        currentAction.current.timeScale = forward ? 1 : -1;
      }
    } else {
      playAction("Idle");
      if (currentAction.current) currentAction.current.timeScale = 1;
    }

    if (left) characterRef.current.rotation.y += 2 * delta;
    if (right) characterRef.current.rotation.y -= 2 * delta;

    const dir = new THREE.Vector3();
    characterRef.current.getWorldDirection(dir);
    
    const currentPos = characterRef.current.position.clone();
    const newPos = currentPos.clone();

    if (forward) {
      newPos.add(dir.clone().multiplyScalar(speed * delta));
    }
    if (backward) {
      newPos.add(dir.clone().multiplyScalar(-speed * delta));
    }

    if (!checkCollision(newPos, CHARACTER_RADIUS)) {
      characterRef.current.position.copy(newPos);
    } else {
      console.log(" ");
    }
  });

  useEffect(() => setCameraHigh(scaleR), [scaleR]);
  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <>
      <primitive
        ref={characterRef}
        object={scene}
        scale={3}
        position={[0, -14, 10]}
        castShadow
        receiveShadow
      />
      
      <CollisionDebugView />
    </>
  );
}