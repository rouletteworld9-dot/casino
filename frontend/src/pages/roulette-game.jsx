import { useEffect, useState } from "react";
import RouletteSpinner from "../components/RouletteSpinner";
import { useGameSocket } from "../hooks/useGameSocket";
import { useAuthStore } from "../stores/useAuthStore";

const RouletteGame = () => {
  const user = useAuthStore((state) => state.user);
  const { lastResults, phase } = useGameSocket(user?._id);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (phase === "result" && lastResults?.length > 0) {
      setResult(lastResults[0]?.toString() || "");
    } else {
      setResult(null);
    }
  }, [phase, lastResults]);

  return (
    <div style={{ textAlign: "center", paddingTop: "20px" }}>
      <RouletteSpinner phase={phase} lastResults={lastResults} />
      <h2>
        {phase === "result" && result !== null ? (
          <span className="font-bold text-2xl">
            🎉 Result: <strong>{result}</strong>
          </span>
        ) : (
          <span className="font-bold text-2xl">{phase}</span>
        )}
      </h2>
    </div>
  );
};

export default RouletteGame;
