// CameraController.jsx
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export function CameraController({ targetRef, cameraHigh }) {
  const { camera, scene } = useThree();

  const cameraPivot = useRef(new THREE.Object3D());
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  const isDragging = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Add pivot to scene
  useEffect(() => {
    scene.add(cameraPivot.current);
    camera.position.set(0, 6, -10);
    camera.lookAt(new THREE.Vector3(0, -8, 0));
  }, [camera, scene]);

  // Mouse drag events
  useEffect(() => {
    const mouseDown = (e) => {
      isDragging.current = true;
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    const mouseUp = () => (isDragging.current = false);
    const mouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - mouseX.current;
      const deltaY = e.clientY - mouseY.current;
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      targetYaw.current -= deltaX * 0.005;
      targetPitch.current -= deltaY * 0.005;
      targetPitch.current = Math.max(
        -Math.PI / 5,
        Math.min(Math.PI / 7, targetPitch.current)
      );
    };

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  // Update camera each frame
  useFrame(() => {
    if (!targetRef.current) return;

    // Smooth rotation
    currentYaw.current = THREE.MathUtils.lerp(
      currentYaw.current,
      targetYaw.current,
      0.1
    );
    currentPitch.current = THREE.MathUtils.lerp(
      currentPitch.current,
      targetPitch.current,
      0.1
    );

    // Move pivot to character
    cameraPivot.current.position.copy(targetRef.current.position);

    // Apply yaw/pitch
    const q = new THREE.Quaternion();
    q.setFromEuler(
      new THREE.Euler(currentPitch.current, currentYaw.current, 0, "YXZ")
    );
    cameraPivot.current.quaternion.copy(q);

    // Camera offset
    const offset = new THREE.Vector3(
      0,
      cameraHigh * (2500 / 4887),
      cameraHigh * (1400 / 1629)
    );
    camera.position.copy(offset);
    camera.position.applyQuaternion(cameraPivot.current.quaternion);
    camera.position.add(cameraPivot.current.position);

    camera.lookAt(cameraPivot.current.position);
  });

  return null;
}

export function CameraController1({ targetRef, isWalking }) {
  const { camera } = useThree();

  const targetYaw = useRef(0);
  const currentYaw = useRef(0);
  const targetPitch = useRef(0);
  const currentPitch = useRef(0);

  const isDragging = useRef(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  // Head bob timer
  const walkTime = useRef(0);

  // Mouse drag events
  useEffect(() => {
    const mouseDown = (e) => {
      isDragging.current = true;
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    const mouseUp = () => (isDragging.current = false);

    const mouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaX = e.clientX - mouseX.current;
      const deltaY = e.clientY - mouseY.current;

      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      targetYaw.current -= deltaX * 0.002;
      targetPitch.current -= deltaY * 0.002;

      targetPitch.current = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2, targetPitch.current));
    };

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    if (!targetRef.current) return;

    // Smooth yaw/pitch values
    currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, targetYaw.current, 0.1);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch.current, 0.1);

    const targetPos = targetRef.current.position;

    // Camera orbit around player
    const radius = 1;
    const x = Math.sin(currentYaw.current) * radius;
    const z = Math.cos(currentYaw.current) * radius;

    // --- WALKING HEAD BOB ---
    let bobX = 0;
    let bobY = 0;

    if (isWalking) {
      walkTime.current += delta * 8; // walking speed
      bobY = Math.sin(walkTime.current) * 0.08;  // up/down movement
      bobX = Math.sin(walkTime.current * 2) * 0.01; // side sway
    } else {
      // Smooth reset when you stop walking
      walkTime.current = THREE.MathUtils.lerp(walkTime.current, 0, 0.05);
    }

    // Final camera position with head bob included
    camera.position.set(
      targetPos.x + x + bobX,
      targetPos.y + 5 + bobY,
      targetPos.z + z
    );

    // Look outward from player
    const outwardDir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();
    const lookTarget = camera.position.clone().add(outwardDir.multiplyScalar(10));
    camera.lookAt(lookTarget);

    // Apply pitch/yaw rotation
    const q = new THREE.Quaternion();
    q.setFromEuler(new THREE.Euler(-currentPitch.current, currentYaw.current, 0, "YXZ"));
    camera.quaternion.copy(q);

    camera.rotateY(Math.PI);
  });

  return null;
}

