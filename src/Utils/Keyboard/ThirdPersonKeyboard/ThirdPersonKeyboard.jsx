// ============================================
// KeyboardThirdPersonSetup.jsx - Updated with onLoad
// ============================================
import KeyboardThirdPersonMovement from "./KeyboardThirdPersonMovement";
import KeyboardThirdPersonCamera from "./KeyboardThirdPersonCamera";
import useMouseDrag from "../useDragMouse";
import { Suspense, useEffect, useState } from "react";
import { CharacterModel } from "../../AvatarLoader/MainCharacterModel";

export default function KeyboardThirdPersonSetup(props) {
  const { mouseDelta, isDragging } = useMouseDrag();
  const [characterModelLoaded, setCharacterModelLoaded] = useState(false);

  // Call onLoad callback when character is loaded
  useEffect(() => {
    if (characterModelLoaded && props.onLoad) {
      props.onLoad();
    }
  }, [characterModelLoaded, props.onLoad]);

  return (
    <>
      <Suspense fallback={null}>
        {props.playerRef?.current && (
          <CharacterModel
            playerRef={props.playerRef}
            animationState={props.animationState}
            onLoad={() => setCharacterModelLoaded(true)}
          />
        )}
      </Suspense>

      {props.playerRef?.current && (
        <KeyboardThirdPersonMovement
          moveInput={props.moveInput}
          playerRef={props.playerRef}
          cameraYaw={props.yaw}
          isRunning={props.isRunning}
          onAnimationStateChange={props.setAnimationState}
        />
      )}

      {props.playerRef?.current && (
        <KeyboardThirdPersonCamera
          playerRef={props.playerRef}
          moveInput={props.moveInput}
          cameraYaw={props.yaw}
          cameraPitch={props.pitch}
          scaleR={props.scaleR}
          mouseDelta={mouseDelta}
          isDragging={isDragging}
        />
      )}
    </>
  );
}