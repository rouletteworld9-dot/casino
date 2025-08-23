import React, { useCallback, useMemo, useState } from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import ChipSelector from "../components/ui/ChipSelector";
import LastResults from "../components/ui/LastResults";

const AutoRoulette = () => {
  const [selectedCoin, setSelectedCoin] = useState(10);
  // Store bets as: [{ position: string, amounts: number[] }]
  const [bets, setBets] = useState([]);
  const [betLocked, setBetLocked] = useState(false);

  // On cell click: if a bet exists, remove it; else, place a bet with selectedCoin
const handleCellClick = useCallback(
  (position) => {
    if (betLocked) return;
    setBets((prev) => {
      const index = prev.findIndex((b) => b.position === position);
      if (index === -1) {
        // No bet, place a new one if a coin is selected
        if (!selectedCoin) return prev;
        return [...prev, { position, amounts: [selectedCoin] }];
      }
      // Bet exists, append selectedCoin to amounts
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        amounts: [...updated[index].amounts, selectedCoin],
      };
      return updated;
      // Commenting out remove coin on click functionality
      // const updated = [...prev];
      // updated.splice(index, 1);
      // return updated;
    });
  },
  [betLocked, selectedCoin]
);
  // On cell drop: if bet exists, add coinValue as a new entry; else add new
  const handleCellDrop = useCallback(
    (position, coinValue) => {
      if (betLocked || !coinValue) return;
      setBets((prev) => {
        const index = prev.findIndex((b) => b.position === position);
        if (index === -1) {
          return [...prev, { position, amounts: [coinValue] }];
        }
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          amounts: [...updated[index].amounts, coinValue],
        };
        return updated;
      });
    },
    [betLocked]
  );

  // Total bet for all cells
  const totalBet = useMemo(
    () =>
      bets.reduce((sum, b) => sum + b.amounts.reduce((s, a) => s + a, 0), 0),
    [bets]
  );

  // Transform bets to required structure for Place Bet
  // Helper to determine type and number for each cell
  function getCellTypeAndNumber(position) {
    // Straight numbers (0-36)
    if (
      /^\d+$/.test(position) &&
      Number(position) >= 0 &&
      Number(position) <= 36
    ) {
      return { type: "straight", number: Number(position) };
    }
    // Dozens
    if (position === "1st12") return { type: "dozen", number: 1 };
    if (position === "2nd12") return { type: "dozen", number: 2 };
    if (position === "3rd12") return { type: "dozen", number: 3 };
    // Columns (right side)
    if (position === "2to1_bottom") return { type: "column", number: 1 };
    if (position === "2to1_middle") return { type: "column", number: 2 };
    if (position === "2to1_top") return { type: "column", number: 3 };
    if (position === "1-18") return { type: "low", number: null };
    if (position === "19-36") return { type: "high", number: null };
    // Red/Black/Even/Odd
    if (["red", "black", "even", "odd"].includes(position)) {
      return { type: position, number: null };
    }
    // Fallback
    return { type: position, number: null };
  }

  const betsPayload = useMemo(() => {
    // Example userId/gameId, replace with real values as needed
    const userId = "123";
    // const gameId = "currentGame001";
    return {
      userId,
      // gameId,
      bets: bets.map((b) => {
        const { type, number } = getCellTypeAndNumber(b.position);
        return {
          type,
          number: [number],
          bets: b.amounts.map((amount) => ({ amount })),
        };
      }),
    };
  }, [bets]);

  // Place Bet button handler
  const handlePlaceBet = () => {
    if (betLocked || bets.length === 0) return;
    setBetLocked(true);
    console.log("Bet Payload to backend:", betsPayload);
    // TODO: Call mutation to place bet with TanStack Query
    // Example: placeBetMutation.mutate(betsPayload)
    // Optionally show toast/notification
    setBets([]); // Clear bets after placing
  };

  return (
    <div
      className="relative w-full flex flex-col items-"
      // style={{
      //   backgroundImage: "url('/game/roulettetable.webp')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <Header />

      <div
        className="pt-20 overflow-hidden max-h-[100vh]"
        style={{
          backgroundImage: "url('/game/roulettetable.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {" "}
        <div className="bg-black/10 absolute top-11 left-140 flex justify-center items-center">
          <LastResults />
        </div>
        {/* Wheel on top */}
        <div className="relative w-full flex justify-center">
          <div className="absolute left-0 z-20">
            <RouletteGame />
          </div>
        </div>
        {/* Place Bet button and Chip selector docked at bottom */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center space-y-2">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            onClick={handlePlaceBet}
            disabled={betLocked || bets.length === 0}
          >
            Place Bet
          </button>
        </div>
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-black/50 backdrop-blur-md px-3 py-2 rounded-full shadow-lg">
            <ChipSelector
              selectedCoin={selectedCoin}
              onSelect={setSelectedCoin}
            />
          </div>
        </div>
        {/* Board below */}
        <div className="w-full z-10">
          <RouletteBoard
            bets={Object.fromEntries(bets.map((b) => [b.position, b.amounts]))}
            onCellClick={handleCellClick}
            onCellDrop={handleCellDrop}
          />
        </div>
        {/* Optional: show current total in the corner */}
        <div className="fixed bottom-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-md text-xs z-30">
          Total Bet: ₹{totalBet}
        </div>
      </div>
    </div>
  );
};

export default AutoRoulette;
