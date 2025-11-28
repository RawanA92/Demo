import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import City from "./City";
import { useDeviceType } from "./Utils/DeviceType";
import { useState, useRef, useMemo, memo } from "react";

import { JoystickGUI } from "./Utils/Joystick/JoystickGUI";
import JoystickSetup from "./Utils/Joystick/JoystickSetup";
import CharacterSetup from "./Utils/Setup";

export default function App() {
  const [isDay, setIsDay] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState([0, 0, 0]);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [clickedObject, setClickedObject] = useState(null);
  const [animationState, setAnimationState] = useState("Idle");

  const [scaleR, setScaleR] = useState(25);
  const [mode, setMode] = useState("Cinematic View");
  const [showControls, setShowControls] = useState(true);

  const [moveInput, setMoveInput] = useState({ x: 0, y: 0 });
  const [lookInput, setLookInput] = useState({ x: 0, y: 0 });

  const playerRef = useRef();
  const yaw = useRef(0);
  const pitch = useRef(0);

  const toggleDayNight = () => {
    setIsDay(!isDay);
  };

  const handleClick = useMemo(() => (event) => {
    event.stopPropagation();
    const point = event.point;
    setSelectedPosition([point.x, point.y, point.z]);

    if (event.object && event.object.parent) {
      const objectName =
        event.object.parent.name || event.object.name || "unknown object";
      setClickedObject(objectName);
    } else {
      setClickedObject("Floor or surface");
    }
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: isDay ? "#87CEEB" : "#0a0a1a",
      }}
    >
      <button
        onClick={toggleDayNight}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: isDay ? "#2c3e50" : "#f39c12",
          color: "white",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
          fontFamily: "Arial, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        }}
      >
        {isDay ? "🌙 " : "☀️"}
      </button>

      {/* {showCoordinates && (
        <CoordinatesDisplay
          selectedPosition={selectedPosition}
          clickedObject={clickedObject}
          isDay={isDay}
        />
      )} */}

      <Canvas
        shadows
        camera={{ near: 0.1, far: 1000, position: [20, 15, 20], fov: 45 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        onClick={handleClick}
      >
        {isDay ? (
          <DayLighting />
        ) : (
          <NightLighting selectedPosition={selectedPosition} />
        )}

        <Physics>
          <City
            position={[4, -12.8, 0]}
            scale={[1, 1, 1]}
            onObjectClick={(position, objectName) => {
              setSelectedPosition(position);
              setClickedObject(objectName);
            }}
          />
        </Physics>
        <mesh ref={playerRef} position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[1, 2, 1]} />
        </mesh>
        <CharacterSetup
          playerRef={playerRef}
          moveInput={moveInput}
          lookInput={lookInput}
          yaw={yaw}
          pitch={pitch}
          animationState={animationState}
          setAnimationState={setAnimationState}
          scaleR={scaleR}
          mode={mode}
        />
      </Canvas>
      {useDeviceType() === "touch" && (
        <JoystickGUI onMoveChange={setMoveInput} onLookChange={setLookInput} />
      )}
      
      <CustomControls
        scaleR={scaleR}
        mode={mode}
        onScaleChange={setScaleR}
        onModeChange={setMode}
        showControls={showControls}
        onToggle={() => setShowControls(!showControls)}
      />
    </div>
  );
}

// OPTIMIZED: Memoized coordinates display
const CoordinatesDisplay = memo(({ selectedPosition, clickedObject, isDay }) => (
  <div
    style={{
      position: "absolute",
      top: "10px",
      left: "10px",
      background: isDay ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
      color: isDay ? "#333" : "white",
      padding: "15px",
      borderRadius: "8px",
      zIndex: 1000,
      fontFamily: "monospace",
      border: isDay ? "2px solid #2c3e50" : "2px solid #00ff00",
      minWidth: "250px",
      transition: "all 0.3s ease",
    }}
  >
    <h3
      style={{
        margin: "0 0 10px 0",
        color: isDay ? "#2c3e50" : "#00ff00",
      }}
    >
      Coordinates{" "}
    </h3>
    <div style={{ marginBottom: "5px" }}>
      <strong>X:</strong> {selectedPosition[0].toFixed(2)}
    </div>
    <div style={{ marginBottom: "5px" }}>
      <strong>Y:</strong> {selectedPosition[1].toFixed(2)}
    </div>
    <div style={{ marginBottom: "10px" }}>
      <strong>Z:</strong> {selectedPosition[2].toFixed(2)}
    </div>
    {clickedObject && (
      <div
        style={{
          marginTop: "10px",
          padding: "8px",
          background: isDay
            ? "rgba(44, 62, 80, 0.1)"
            : "rgba(0, 255, 0, 0.1)",
          borderRadius: "4px",
          fontSize: "12px",
          border: isDay ? "1px solid #2c3e50" : "1px solid #00ff00",
        }}
      >
        <strong>The specific:</strong> {clickedObject}
      </div>
    )}
    <div
      style={{
        marginTop: "10px",
        fontSize: "11px",
        color: isDay ? "#666" : "#ccc",
        fontStyle: "italic",
      }}
    >
      Click on any object to see its coordinates{" "}
    </div>
  </div>
));

// OPTIMIZED: Day lighting with reduced shadows and consolidated lights
const DayLighting = memo(() => (
  <>
    <Environment
      preset="sunset"
      background={false}
      environmentIntensity={1.5}
    />

    <directionalLight
      castShadow
      intensity={3.5}
      position={[50, 120, 50]}
      color="#FFF8E1"
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0005}
      shadow-normalBias={0.05}
      shadow-camera-far={500}
      shadow-camera-left={-400}
      shadow-camera-right={400}
      shadow-camera-top={400}
      shadow-camera-bottom={-400}
    />

    <ambientLight intensity={1} color="#FFF8E1" />

    <hemisphereLight
      skyColor="#87CEEB"
      groundColor="#F0E68C"
      intensity={1.2}
    />

    <directionalLight
      position={[-30, 100, -30]}
      intensity={1.2}
      color="#FFEBB8"
    />
  </>
));

// OPTIMIZED: Night lighting with instanced street lights and reduced point lights
const NightLighting = memo(({ selectedPosition }) => {
  // OPTIMIZED: Consolidated street lights into fewer, more efficient groups
  const streetLightGroups = useMemo(() => {
    // Group 1: Main street lights (consolidated with larger coverage)
    const mainStreetPositions = [
      [-70.65, -1.52, -21.67], [-97.94, -1.52, -21.65],
      [-99.01, -1.52, 21.23], [-71.73, -1.52, 21.24],
      [55.13, -1.52, -21.89], [54.06, -1.52, 21.32],
      [82.42, -1.52, -21.61], [81.34, -1.52, 21.35],
      [109.71, -1.52, -21.58], [108.65, -1.52, 21.38],
      [-44.13, -1.52, 18.5], [-43.36, -1.52, -21.89],
    ];

    // Group 2: Perimeter lights (consolidated)
    const perimeterPositions = [
      [-18.09, -1.52, 46.2], [25.72, -1.52, 45.05],
      [-18.12, -1.52, 101.48], [25.48, -1.52, 100.33],
      [-70.65, -1.52, 130.6], [-97.94, -1.52, 130.57],
      [-127.24, -1.52, 100.33], [-127.09, -1.52, 73.04],
      [-127.21, -1.52, 45.75],
    ];

    // Group 3: Back street lights (consolidated)
    const backStreetPositions = [
      [25.51, -1.52, -107.32], [25.55, -1.52, -80.03],
      [25.59, -1.52, -52.74], [-17.97, -1.52, -106.16],
      [-17.9, -1.52, -51.59], [54.06, -1.52, -130.98],
      [81.34, -1.52, -131.12], [108.65, -1.52, -131.07],
    ];

    // Group 4: East side lights (consolidated)
    const eastSidePositions = [
      [134.38, -1.52, -106.16], [134.38, -1.52, -51.59],
      [134.38, -1.52, 101.48], [134.38, -1.52, 74.2],
      [134.38, -1.52, 46.91], [109.71, -1.52, 130.78],
      [82.42, -1.52, 130.78], [54.35, -1.52, 130.78],
    ];

    // Group 5: West side lights (consolidated)
    const westSidePositions = [
      [-44.42, -1.52, -131.19], [-71.73, -1.52, -131.19],
      [-127.11, -1.52, -107.32], [-127.11, -1.52, -80.03],
      [-127.11, -1.52, -52.5],
    ];

    return [
      { positions: mainStreetPositions, intensity: 6, distance: 60, decay: 0.6 },
      { positions: perimeterPositions, intensity: 5, distance: 55, decay: 0.65 },
      { positions: backStreetPositions, intensity: 5, distance: 55, decay: 0.65 },
      { positions: eastSidePositions, intensity: 5, distance: 50, decay: 0.7 },
      { positions: westSidePositions, intensity: 5, distance: 50, decay: 0.7 },
    ];
  }, []);

  // OPTIMIZED: Al Faisaliyah building lights (consolidated)
  const faisaliyahLights = useMemo(() => {
    const positions = [
      [3.54, 150.13, -254.05, 10.0, 300, 0.3],
      [0.2, 122.57, -253.15, 4.0, 155, 0.5],
      [43.32, 6.35, -271.76, 6.0, 120, 0.4],
      [43.32, 6.35, -244.6, 6.0, 120, 0.4],
      [43.32, 6.35, -222.5, 6.0, 120, 0.4],
      [43.32, 6.35, -183.69, 6.0, 120, 0.4],
      [43.32, 6.35, -159.89, 6.0, 120, 0.4],
      [-0.65, -12.48, -163.08, 6.0, 120, 0.4],
      [-0.65, -12.48, -195.57, 6.0, 120, 0.4],
      [-33.38, -12.48, -269.94, 6.0, 120, 0.4],
    ];

    return positions.map((pos, i) => (
      <pointLight
        key={`faisaliyah-${i}`}
        position={[pos[0], pos[1], pos[2]]}
        intensity={pos[3]}
        color="#f4f4f1ff"
        distance={pos[4]}
        decay={pos[5]}
      />
    ));
  }, []);

  // OPTIMIZED: Albaik restaurant lights (consolidated into 2 lights)
  const albaikLights = useMemo(() => (
    <>
      <pointLight
        position={[-91.78, 11.2, -21.07]}
        intensity={8.0}
        color="#FFFFFF"
        distance={120}
        decay={0.4}
      />
    </>
  ), []);

  return (
    <>
      <Environment
        preset="night"
        background={true}
        environmentIntensity={0.3}
      />

      <directionalLight
        castShadow
        intensity={0.8}
        position={[-30, 80, -40]}
        color="#E6F3FF"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-normalBias={0.05}
        shadow-camera-far={300}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />

      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* OPTIMIZED: Consolidated central area lights */}
      <pointLight
        position={[0, 8, 0]}
        intensity={3.5}
        color="#FFF8E1"
        distance={40}
        decay={1.2}
      />
      <pointLight
        position={[15, 12, 10]}
        intensity={2.5}
        color="#FFA500"
        distance={45}
        decay={1.0}
      />
      <pointLight
        position={[-15, 12, -10]}
        intensity={2.5}
        color="#FF6B6B"
        distance={45}
        decay={1.0}
      />

      <hemisphereLight
        skyColor="#0f1a2a"
        groundColor="#1a0f2a"
        intensity={0.3}
      />

      <directionalLight
        position={[20, 60, 20]}
        intensity={0.3}
        color="#4A6FA5"
      />

      {/* OPTIMIZED: Landmark building lights (consolidated) */}
      <pointLight
        position={[100, 50, -120]}
        intensity={3.0}
        color="#FFFFFF"
        distance={60}
        decay={1.0}
      />
      <pointLight
        position={[130, 40, -60]}
        intensity={2.5}
        color="#FFFFFF"
        distance={55}
        decay={1.0}
      />

      {/* Al Faisaliyah lights */}
      {faisaliyahLights}

      {/* Albaik restaurant lights */}
      {albaikLights}

      {/* OPTIMIZED: Street lights with grouped rendering */}
      {streetLightGroups.map((group, groupIndex) =>
        group.positions.map((pos, i) => (
          <pointLight
            key={`street-${groupIndex}-${i}`}
            position={pos}
            intensity={group.intensity}
            color="#FFFFFF"
            distance={group.distance}
            decay={group.decay}
          />
        ))
      )}

      <pointLight
        position={[-60, 8, -100]}
        intensity={2.5}
        color="#FFA500"
        distance={40}
        decay={1.0}
      />

      <pointLight
        position={[45.19, 81.9, 111.12]}
        intensity={5.3}
        color="#FFFFFF"
        distance={200}
        decay={0.5}
      />
    </>
  );
});

// OPTIMIZED: Reduced geometry complexity
const Cursor = memo(({ position }) => (
  <group position={position}>
    <mesh>
      <sphereGeometry args={[0.8, 8, 8]} />
      <meshBasicMaterial color="red" transparent opacity={0.8} />
    </mesh>

    <mesh rotation={[0, 0, Math.PI / 4]}>
      <boxGeometry args={[3, 0.1, 0.1]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
    <mesh rotation={[0, 0, -Math.PI / 4]}>
      <boxGeometry args={[3, 0.1, 0.1]} />
      <meshBasicMaterial color="yellow" />
    </mesh>

    <mesh position={[0, 2, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 4, 6]} />
      <meshBasicMaterial color="cyan" />
    </mesh>

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <ringGeometry args={[1, 3, 16]} />
      <meshBasicMaterial color="#00ff00" />
    </mesh>
  </group>
));

function CustomControls({ scaleR, mode, onScaleChange, onModeChange, showControls, onToggle }) {
  // Show small button when controls are hidden
  if (!showControls) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          zIndex: 1001,
          padding: "12px",
          fontSize: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          color: "#00ff88",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          transition: "all 0.3s ease",
          fontFamily: "system-ui, sans-serif",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.05)";
          e.target.style.boxShadow = "0 6px 16px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
        }}
      >
        🎮
      </button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        zIndex: 1000,
        fontFamily: "system-ui, sans-serif",
        minWidth: "260px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3
          style={{
            margin: "0",
            fontSize: "16px",
            color: "#00ff88",
            fontWeight: "600",
          }}
        >
          🎮 Controls
        </h3>
        <button
          onClick={onToggle}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "#00ff88",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
          }}
        >
          Hide
        </button>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "13px",
            color: "#aaa",
          }}
        >
          Scale Range
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="range"
            min="18"
            max="48.87"
            step="0.01"
            value={scaleR}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            onKeyDown={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              cursor: "pointer",
              accentColor: "#00ff88",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: "500",
              minWidth: "50px",
              color: "#00ff88",
            }}
          >
            {scaleR.toFixed(2)}
          </span>
        </div>
      </div>

      <div>
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            fontSize: "13px",
            color: "#aaa",
          }}
        >
          Camera Mode
        </label>
        <select
          value={mode}
          onChange={(e) => {
            onModeChange(e.target.value);
            setTimeout(() => e.target.blur(), 100);
          }}
          onKeyDown={(e) => {
            if (
              ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                e.key
              )
            ) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 0.2)",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          <option
            value="First-Prespective"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            First-Perspective
          </option>
          <option
            value="Third-Prespective"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            Third-Perspective
          </option>
          <option
            value="Cinematic View"
            style={{ background: "#1a1a1a", color: "white" }}
          >
            Cinematic View
          </option>
        </select>
      </div>

      <div
        style={{
          marginTop: "15px",
          fontSize: "11px",
          color: "#666",
          fontStyle: "italic",
        }}
      >
        💡 Use WASD + Arrow keys to move
      </div>
    </div>
  );
}