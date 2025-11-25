// MobileJoystick.jsx
import { Joystick } from "react-joystick-component";
import { usePlayerMovement } from "./usePlayerMovement";

export default function MobileJoystick() {
  const setMove = usePlayerMovement((s) => s.setMoveVector);

  return (
    <div style={{ position: "absolute", bottom: 30, left: 30 }}>
      <Joystick
        size={130}
        baseColor="rgba(255,255,255,0.25)"
        stickColor="white"
        move={(data) => {
          setMove(data.x / 100, data.y / 100);
        }}
        stop={() => setMove(0, 0)}
      />
    </div>
  );
}
