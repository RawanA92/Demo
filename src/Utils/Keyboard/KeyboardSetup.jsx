// ============================================
// KeyboardSetup.jsx - Updated to pass isRunning only
// ============================================
import useKeyboardInput from "./useKeyboardInput.jsx";
import { Suspense, useRef } from "react";
import KeyboardFirstPersonSetup from "./FirstPersonKeyboard/FirstPersonKeyboard.jsx";
import KeyboardThirdPersonSetup from "./ThirdPersonKeyboard/ThirdPersonKeyboard.jsx";
import { CharacterModel } from "../AvatarLoader/MainCharacterModel.jsx";
import { useEffect } from "react";
import PhysicsCharacterWrapper from "./PhysicsCharacterWrapper.jsx";
import { RigidBody } from "@react-three/rapier";
export default function KeyboardSetup({
  scaleR,
  mode,
  playerRef: externalPlayerRef,
  animationState,
  setAnimationState,
  initialPosition = { x: 0, y: -14, z: 0 },
}) {
  const localPlayerRef = useRef();
  const playerRef = externalPlayerRef || localPlayerRef;
  const yaw = useRef(0);
  const pitch = useRef(0);

  const { moveInput, lookInput, isRunning } = useKeyboardInput();

  // Set initial position
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z
      );
    }
  }, []);

  return (
    <>
      {mode === "First-Prespective" && (
        <KeyboardFirstPersonSetup
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          isRunning={isRunning}
          animationState={animationState}
          setAnimationState={setAnimationState}
        />
      )}

      {mode === "Third-Prespective" && (
        // <PhysicsCharacterWrapper
        //   playerRef={playerRef}
        //   moveInput={moveInput}
        //   isRunning={isRunning}
        // >
        // <RigidBody>
          <KeyboardThirdPersonSetup
            playerRef={playerRef}
            moveInput={moveInput}
            lookInput={lookInput}
            yaw={yaw}
            pitch={pitch}
            isRunning={isRunning}
            animationState={animationState}
            setAnimationState={setAnimationState}
            scaleR={scaleR}
          />
          // </RigidBody>
      )}
    </>
  );
}
