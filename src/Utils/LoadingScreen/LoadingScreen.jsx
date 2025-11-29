import { memo } from "react";

// Loading Screen Component
const LoadingScreen = memo(({ progress }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "system-ui, sans-serif",
    }}
  >
    {/* Animated logo/title */}
    <div
      style={{
        fontSize: "48px",
        fontWeight: "bold",
        background: "linear-gradient(135deg, #00ff88, #00ccff, #00ff88)",
        backgroundSize: "200% 200%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradient 3s ease infinite",
        marginBottom: "40px",
        textAlign: "center",
      }}
    >
      🏙️ Tuwaiq City
    </div>

    {/* Loading bar container */}
    <div
      style={{
        width: "300px",
        height: "6px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 0 20px rgba(0, 255, 136, 0.3)",
      }}
    >
      {/* Loading bar progress */}
      <div
        style={{
          width: `${Math.min(progress, 100)}%`,
          height: "100%",
          background: "linear-gradient(90deg, #00ff88, #00ccff)",
          borderRadius: "10px",
          transition: "width 0.3s ease",
          boxShadow: "0 0 10px rgba(0, 255, 136, 0.8)",
        }}
      />
    </div>

    {/* Loading percentage */}
    <div
      style={{
        marginTop: "20px",
        fontSize: "18px",
        color: "#00ff88",
        fontWeight: "500",
      }}
    >
      {Math.floor(progress)}%
    </div>

    {/* Loading text */}
    <div
      style={{
        marginTop: "10px",
        fontSize: "14px",
        color: "rgba(255, 255, 255, 0.6)",
        fontStyle: "italic",
      }}
    >
      Loading assets...
    </div>

    {/* CSS Animation */}
    <style>
      {`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}
    </style>
  </div>
));

export default LoadingScreen;