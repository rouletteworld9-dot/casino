import React, { useEffect, useState } from "react";
import { useGameStore } from "../../stores/useGameStore";
import { IndianRupee } from "lucide-react";
import { useDelay } from "../../hooks/useDelay";

const ResultOverlay = () => {
  const [showWinMessage, setShowWinMessage] = useState(false);

  const {
    winStatus: { isWin, amount },
  } = useGameStore();

  // Delay win status by 5s
  const isWinDelayed = useDelay(isWin, 5000);
  console.log(isWin, "is win");
  console.log(isWinDelayed, "win delayedd");

  useEffect(() => {
    if (isWinDelayed === true) {
      const t = setTimeout(() => {
        setShowWinMessage(true);
      }, 3000);

      return () => clearTimeout(t);
    } else {
      // reset when not win
      setShowWinMessage(false);
    }
  }, [isWinDelayed]);

  // ✅ Only render when delayed win is true and message should be visible
  if (
    isWinDelayed === null ||
    isWinDelayed === false ||
    isWin === null ||
    isWin === false
  )
    return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        left: 0,
        width: "100vw",
        height: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: "clamp(1.5rem, 6vw, 2rem)",
          fontWeight: 500,
          color: "#facc15",
          width: "clamp(180px, 85vw, 280px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "clamp(0.75rem, 4vw, 1rem) clamp(1.25rem, 5vw, 2rem)",
          borderTop: "2px solid #facc15",
          borderBottom: "2px solid #facc15",
          background:
            "linear-gradient(180deg, rgba(250, 204, 251, 0), rgba(0, 0, 0, 0.5))",
          borderRadius: "0.5rem",
        }}
      >
        <span>You won</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "clamp(1.2rem, 5vw, 1.6rem)",
          }}
        >
          <IndianRupee size={20} style={{ marginRight: "0.5rem" }} /> {amount}
        </span>
      </span>
    </div>
  );
};

export default React.memo(ResultOverlay);
