import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CharacterController() {
  const { scene, animations } = useGLTF("/character1.glb");
  const characterRef = useRef();
  const { actions, mixer } = useAnimations(animations, characterRef);
  const currentAction = useRef(null);
  const keys = useRef({});

  // --- camera ---
  const { camera, scene: threeScene } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const mouseX = useRef(0);
  const cameraRotationY = useRef(0);

  // --- pivot for camera ---
  const cameraPivot = useRef(new THREE.Object3D());

  useEffect(() => {
    threeScene.add(cameraPivot.current);
    cameraPivot.current.add(camera);
    camera.position.set(0, 2, -5);
    camera.lookAt(new THREE.Vector3(0, 1, 0));
  }, [camera, threeScene]);

  // --- keyboard ---
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

  // --- mouse drag for camera rotation ---
  useEffect(() => {
    const mouseDown = (e) => {
      setIsDragging(true);
      mouseX.current = e.clientX;
    };
    const mouseUp = () => setIsDragging(false);
    const mouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - mouseX.current;
      mouseX.current = e.clientX;
      cameraRotationY.current -= deltaX * 0.005;
    };

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [isDragging]);

  // --- play looping animation ---
  const playAction = (name) => {
    if (!actions[name]) return;
    if (
      currentAction.current === actions[name] &&
      !currentAction.current.paused
    )
      return;

    const next = actions[name];
    next.reset();
    next.setLoop(THREE.LoopRepeat, Infinity);
    next.paused = false;
    next.fadeIn(0.2).play();

    if (currentAction.current && currentAction.current !== next) {
      currentAction.current.fadeOut(0.2);
    }
    currentAction.current = next;
  };

  // --- initial idle pose ---
  // --- initial idle pose ---
  useEffect(() => {
    if (actions["Idle"]) {
      const idle = actions["Idle"];
      idle.reset();
      idle.setLoop(THREE.LoopRepeat, Infinity); // loop Idle
      idle.paused = false; // start playing
      idle.fadeIn(0.2).play(); // smooth fade-in
      currentAction.current = idle;
    }
  }, [actions]);

  useFrame((_, delta) => {
    if (!characterRef.current) return;

    const forward = keys.current["w"] || keys.current["arrowup"];
    const backward = keys.current["s"] || keys.current["arrowdown"];
    const left = keys.current["a"] || keys.current["arrowleft"];
    const right = keys.current["d"] || keys.current["arrowright"];
    const ctrl = keys.current["control"];

    let speed = 3; // normal walk speed
    let actionName = null;

    if (forward || backward) {
      if (ctrl) {
        speed = 6; // double speed for running
        actionName = "Run"; // use Run animation
      } else {
        speed = 3;
        actionName = "Walk"; // use Walk animation
      }

      const action = actions[actionName];
      if (backward) {
        if (currentAction.current !== action || action.timeScale > 0) {
          action.reset();
          action.paused = false;
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.timeScale = -1; // reverse for backward
          action.fadeIn(0.2).play();
          if (currentAction.current && currentAction.current !== action) {
            currentAction.current.fadeOut(0.2);
          }
          currentAction.current = action;
        }
      } else {
        if (action) {
          playAction(actionName);
          currentAction.current.timeScale = 1;
        }
      }
    } else {
      // idle
      if (actions["Idle"] && currentAction.current !== actions["Idle"]) {
        playAction("Idle");
        currentAction.current.timeScale = 1;
      }
    }

    // --- character rotation ---
    if (left) characterRef.current.rotation.y += 2 * delta;
    if (right) characterRef.current.rotation.y -= 2 * delta;

    // --- move forward/backward relative to rotation ---
    const dir = new THREE.Vector3();
    characterRef.current.getWorldDirection(dir);

    if (forward)
      characterRef.current.position.add(
        dir.clone().multiplyScalar(speed * delta)
      );
    if (backward)
      characterRef.current.position.add(
        dir.clone().multiplyScalar(-speed * delta)
      );

    // --- move pivot to character ---
    cameraPivot.current.position.copy(characterRef.current.position);
    cameraPivot.current.rotation.y = cameraRotationY.current;
  });

  // --- cleanup ---
  useEffect(() => () => mixer?.stopAllAction(), [mixer]);

  return (
    <group ref={characterRef} scale={1} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}
