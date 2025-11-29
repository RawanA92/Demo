import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

function ease(t) {
  t = Math.min(Math.max(t, 0), 1);
  return t * t * (3 - 2 * t);
}

const center = new THREE.Vector3(0, 0, 2);
const pathCorners = [
  new THREE.Vector3(0, 2.1, 164),   // South
  new THREE.Vector3(165, 2.1, 165), // Eastern South
  new THREE.Vector3(165, 2.1, -155),// Eastern North
  new THREE.Vector3(-165, 2.1, -155),// Western North
  new THREE.Vector3(-165, 2.1, 165), // Western South
  new THREE.Vector3(0, 2.1, 165),   // South again
  new THREE.Vector3(0, 2.1, -165),  // North
  new THREE.Vector3(0, 180, 0),     // Final point (upwards)
];

export default function SquareDroneCamera() {
  const camRef = useRef();
  const segment = useRef(0);
  const progress = useRef(0);
  const speed = 0.05;

  const [flag, setFlag] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const waitTimer = useRef(0);

  const lookTarget = useRef(center.clone());
  const desiredLook = useRef(center.clone());

  useFrame((_, delta) => {
    // If we are waiting at the final point
    if (waiting) {
      waitTimer.current += delta;
      // keep camera fixed at final point
      camRef.current.position.copy(pathCorners[pathCorners.length - 1]);
      camRef.current.lookAt(center);
      camRef.current.updateProjectionMatrix();

      if (waitTimer.current >= 3.5) { // wait ~3–4 seconds
        // reset everything
        segment.current = 0;
        progress.current = 0;
        waitTimer.current = 0;
        setWaiting(false);
        lookTarget.current.copy(center);
        desiredLook.current.copy(center);
        setFlag(false);
      }
      return; // skip normal movement while waiting
    }

    progress.current += delta * speed;
    const t = ease(progress.current);

    const start = pathCorners[segment.current];
    const end = pathCorners[segment.current + 1];

    if (end) {
      const currentPos = new THREE.Vector3().lerpVectors(start, end, t);
      camRef.current.position.copy(currentPos);
    }

    if (progress.current >= 1) {
      segment.current++;
      progress.current = 0;

      // when starting the last segment (north → final point), set desired look to center
      if (segment.current === pathCorners.length - 2) {
        setFlag(false);
        desiredLook.current.copy(center);
      }

      // if we just finished the last segment, start waiting
      if (segment.current >= pathCorners.length - 1) {
        setWaiting(true);
      }
    }

    // special case: when at south corner, change look target
    if (
      Math.abs(camRef.current.position.z - 145) < 0.5 &&
      Math.abs(camRef.current.position.x) < 0.5
    ) {
      setFlag(true);
      desiredLook.current.set(0, 2.1, -150);
    }

    // Smoothly rotate toward desiredLook
    lookTarget.current.lerp(desiredLook.current, 0.02);

    camRef.current.lookAt(lookTarget.current);
    camRef.current.updateProjectionMatrix();
  });

  return <PerspectiveCamera ref={camRef} makeDefault fov={60} far={1000} />;
}
