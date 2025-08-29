import { useEffect, useState } from "react";
// import RouletteSpinner from "../components/RouletteSpinner";
import { useGameSocket } from "../hooks/useGameSocket";
import { useAuthStore } from "../stores/useAuthStore";
import Wheel from "../components/wheel";
import { useGameStore } from "../stores/useGameStore";

const RouletteGame = () => {
  const { lastResults, phase } = useGameStore();
  const rouletteData = {
    numbers: [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ],
  };

  const number = {
    next: lastResults[0]?.result,
    current: lastResults[1]?.result,
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* <RouletteSpinner phase={phase} lastResults={lastResults} /> */}
      <Wheel number={number} rouletteData={rouletteData} phase={phase} />
      {/* <h2>
        {phase === "result" && result !== null ? (
          <span className="font-bold text-white text-2xl">
            🎉 Result: <strong>{result}</strong>
          </span>
        ) : (
          <span className="font-bold text-white text-2xl">{phase}</span>
        )}
      </h2> */}
    </div>
  );
};

export default RouletteGame;
