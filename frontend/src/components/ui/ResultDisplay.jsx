import React from "react";
import { useGameStore } from "../../stores/useGameStore";
import { useDelay } from "../../hooks/useDelay";

const numbers = [
  { num: 0, color: "green" },
  { num: 32, color: "red" },
  { num: 15, color: "black" },
  { num: 19, color: "red" },
  { num: 4, color: "black" },
  { num: 21, color: "red" },
  { num: 2, color: "black" },
  { num: 25, color: "red" },
  { num: 17, color: "black" },
  { num: 34, color: "red" },
  { num: 6, color: "black" },
  { num: 27, color: "red" },
  { num: 13, color: "black" },
  { num: 36, color: "red" },
  { num: 11, color: "black" },
  { num: 30, color: "red" },
  { num: 8, color: "black" },
  { num: 23, color: "red" },
  { num: 10, color: "black" },
  { num: 5, color: "red" },
  { num: 24, color: "black" },
  { num: 16, color: "red" },
  { num: 33, color: "black" },
  { num: 1, color: "red" },
  { num: 20, color: "black" },
  { num: 14, color: "red" },
  { num: 31, color: "black" },
  { num: 9, color: "red" },
  { num: 22, color: "black" },
  { num: 18, color: "red" },
  { num: 29, color: "black" },
  { num: 7, color: "red" },
  { num: 28, color: "black" },
  { num: 12, color: "red" },
  { num: 35, color: "black" },
  { num: 3, color: "red" },
  { num: 26, color: "black" },
];

const ResultDisplay = ({ className }) => {
  const lastResults = useGameStore((s) => s.lastResults);
  const phase = useGameStore((s) => s.phase);
  const winning = phase === "result" ? lastResults[0]?.result : null;
  const winningNumber = useDelay(winning, 5000);

  if (phase !== "result" || !winningNumber) return null;
  const index = numbers.findIndex((n) => n.num === winningNumber);
  if (index === -1) return null;

  const leftNeighbor = numbers[(index - 1 + numbers.length) % numbers.length];
  const rightNeighbor = numbers[(index + 1) % numbers.length];
  const winner = numbers[index];

  return (
    <div className="w-full flex justify-center sm:justify-center pointer-events-none py-2">
      <div
        className={`flex items-center relative bg-black/50 text-xl font-bold ${className}`}
      >
        {/* Left neighbor */}
        <div
          style={{
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
          }}
          className="flex items-center justify-center w-20 h-13 text-2xl text-gray-200/20 -rotate-12 border-y-2 border-gray-300/50 -mr-[3px]"
        >
          {leftNeighbor.num}
        </div>

        {/* Winner (pops out in front) */}
        <div
          style={{
            clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
          }}
          className="inline-block p-[3px] bg-yellow-400 shadow-lg z-10 -mx-2"
        >
          <div
            style={{
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
            className={`flex items-center justify-center w-24 h-18 text-3xl font-bold ${
              winner.color === "red"
                ? "bg-red-600 text-white"
                : winner.color === "black"
                  ? "bg-black text-white"
                  : "bg-green-600 text-white"
            }`}
          >
            {winner.num}
          </div>
        </div>

        {/* Right neighbor */}
        <div
          style={{
            clipPath: "polygon(15% 0, 85% 0, 100% 100%, 0% 100%)",
          }}
          className="flex items-center justify-center w-20 h-13 text-2xl text-gray-200/20 rotate-12 border-y-2 border-gray-300/50 -ml-[3px]"
        >
          {rightNeighbor.num}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
