import * as THREE from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";

function ease(t) {
  t = Math.min(Math.max(t, 0), 1);
  return t * t * (3 - 2 * t);
}

const center = new THREE.Vector3(0, 0, 0);
const pathCorners = [
  new THREE.Vector3(0, 700, 4499), // South
  new THREE.Vector3(4500, 700, 4500), // Eastern South
  new THREE.Vector3(4500, 700, -4500), // Eastern North
  new THREE.Vector3(-4500, 700, -4500), // Western North
  new THREE.Vector3(-4500, 700, 4500), // Western South
  new THREE.Vector3(0, 700, 4500), // South
  new THREE.Vector3(0, 700, -4500), // North
];

export default function SquareDroneCamera() {
  const camRef = useRef();
  const segment = useRef(0);
  const progress = useRef(0);
  const speed = 0.05;

  const [flag, setFlag] = useState(false);

  // هدف النظر الحالي والمطلوب
  const lookTarget = useRef(center.clone());
  const desiredLook = useRef(center.clone());

  useFrame((_, delta) => {
    if (segment.current >= pathCorners.length - 1) {
      segment.current = 0;
      progress.current = 0;
    }
    progress.current += delta * speed;
    const t = ease(progress.current);

    const start = pathCorners[segment.current];
    const end = pathCorners[segment.current + 1];

    const currentPos = new THREE.Vector3().lerpVectors(start, end, t);
    camRef.current.position.copy(currentPos);

    // لو خلص الضلع → نروح للضلع اللي بعده
    if (progress.current >= 1) {
      segment.current++;
      progress.current = 0;
    }

    // لما نوصل للنقطة المحددة → غير الهدف
    if (camRef.current.position.z === 4500 && camRef.current.position.x === 0) {
      setFlag(true);
      desiredLook.current.set(0, 900, -5000); // الهدف الجديد
    }

    // لو flag true → اعمل lerp تدريجي للـ lookTarget
    if (flag) {
      lookTarget.current.lerp(desiredLook.current, 0.02); // معدل السرعة
    } else {
      lookTarget.current.copy(center);
    }

    camRef.current.lookAt(lookTarget.current);
    camRef.current.updateProjectionMatrix();
  });

  return <PerspectiveCamera ref={camRef} makeDefault fov={60} far={20000} />;
}
