import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export function CharacterModel({ playerRef, rigidBodyRef, animationState, onLoad }) {
  const { scene, animations } = useGLTF("/Character.glb");
  console.log(scene, animations);
  const mixerRef = useRef();
  const actionsRef = useRef({});
  const currentActionRef = useRef();

  // Call onLoad when model and animations are ready
  useEffect(() => {
    if (scene && animations.length > 0 && onLoad) {
      // Small delay to ensure everything is fully loaded and rendered
      const timer = setTimeout(() => {
        onLoad();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [scene, animations, onLoad]);

  useEffect(() => {
    if (!scene || !animations.length) return;

    mixerRef.current = new THREE.AnimationMixer(scene);

    animations.forEach((clip) => {
      const action = mixerRef.current.clipAction(clip);
      actionsRef.current[clip.name] = action;
    });

    if (actionsRef.current['Armature_1|mixamo.com|Layer0.007']) {
      actionsRef.current['Armature_1|mixamo.com|Layer0.007'].play();
      currentActionRef.current = actionsRef.current['Armature_1|mixamo.com|Layer0.007'];
    }

    return () => mixerRef.current?.stopAllAction();
  }, [scene, animations]);

  useEffect(() => {
    if (!actionsRef.current || !animationState) return;

    const animationMap = {
      idle: animations[2].name,
      walk: animations[0].name,
      run: animations[1].name,
    };

    const targetAction = actionsRef.current[animationMap[animationState]];

    if (targetAction && targetAction !== currentActionRef.current) {
      currentActionRef.current?.fadeOut(0.2);
      targetAction.reset().fadeIn(0.2).play();
      currentActionRef.current = targetAction;
    }
  }, [animationState, animations]);

  useFrame((state, delta) => {
    // Sync playerRef with physics body position/rotation
    if (rigidBodyRef.current && playerRef.current) {
      const physicsPos = rigidBodyRef.current.translation();
      playerRef.current.position.set(physicsPos.x, physicsPos.y, physicsPos.z);
      
      const physicsRot = rigidBodyRef.current.rotation();
      playerRef.current.rotation.y = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion(physicsRot.x, physicsRot.y, physicsRot.z, physicsRot.w)
      ).y;
    }

    // Update animations
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef} // This will be passed from parent
      type="dynamic"
      colliders={false}
      position={[0, -13, 0]}
      lockRotations
      canSleep={false}
    >
      <CapsuleCollider args={[1.4, 1.7]} position={[0, 2, 0]} />
      <primitive
        object={scene}
        scale={3}
        position={[0, -1, 0]}
        castShadow
        receiveShadow
      />
    </RigidBody>
  );
}

// Preload the model for better performance
useGLTF.preload("/Character.glb");