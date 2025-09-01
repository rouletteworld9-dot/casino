import React from "react";
import { useGameSocket } from "../../hooks/useGameSocket";
import { useAuthStore } from "../../stores/useAuthStore";
import { useDelay } from "../../hooks/useDelay";
import { useGameStore } from "../../stores/useGameStore";

const rouletteColors = {
  red: [
    1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36
  ],
  black: [
    2, 4, 6, 8, 10, 11, 13, 15, 17,
    20, 22, 24, 26, 28, 29, 31, 33, 35
  ]
};

const getColorClass = (num) => {
  if (num === 0) return "bg-green-600 text-white"; // 0 is always green
  if (rouletteColors.red.includes(num)) return "bg-red-600 text-white";
  if (rouletteColors.black.includes(num)) return "bg-black text-white";
  return "bg-gray-500 text-white"; // fallback
};

const LastResults = () => {
  const { lastResults } = useGameStore();

  const delayedResults = useDelay(lastResults, 5000);

  return (
    <div className="z-60 flex sm:gap-1 items-center justify-center">
      {delayedResults?.map((res, idx) => (
        <div
          key={res.roundId || idx}
          className={`w-7 sm:w-8 h-5 sm:h-8 flex items-center justify-center sm:rounded-md text-xs sm:text-sm font-bold border border-white shadow-md ${getColorClass(res.result)}`}
        >
       
          {res.result}
        </div>
      ))}
    </div>
  );
};

export default LastResults;
