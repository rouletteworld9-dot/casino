import React, { useCallback, useMemo, useState } from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import ChipSelector from "../components/ui/ChipSelector";
import LastResults from "../components/ui/LastResults";
import { useAuthStore } from "../stores/useAuthStore";
import { useGameSocket } from "../hooks/useGameSocket";
import PhaseTimer from "../components/ui/PhaseTimer";

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);
  const { phase } = useGameSocket(user?._id);
  const [selectedCoin, setSelectedCoin] = useState(10);
  const [bets, setBets] = useState([]);

  // On cell click: if bet exists, remove it; if not, do nothing
  const handleCellClick = useCallback((position) => {
    setBets((prev) => {
      const index = prev.findIndex((b) => b.position === position);
      if (index === -1) {
        // No bet to remove
        return prev;
      }
      // Remove the bet
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const handleCellDrop = useCallback((position, coinValue) => {
    if (!coinValue) return;
    setBets((prev) => {
      const index = prev.findIndex((b) => b.position === position);
      if (index === -1) {
        return [...prev, { position, amount: coinValue }];
      }
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        amount: updated[index].amount + coinValue,
      };
      return updated;
    });
  }, []);

  const totalBet = useMemo(
    () => bets.reduce((sum, b) => sum + (b?.amount || 0), 0),
    [bets]
  );

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
        {/* Chip selector docked at bottom */}
        <div
          className={`
    fixed left-1/2 -translate-x-1/2 z-30
    transition-all duration-700 ease-in-out
    ${
      phase === "betting"
        ? "opacity-100 bottom-4 pointer-events-auto"
        : "opacity-0 bottom-0 pointer-events-none"
    }
  `}
        >
          <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
            <ChipSelector
              selectedCoin={selectedCoin}
              onSelect={setSelectedCoin}
            />
          </div>
        </div>
        <div
          className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100`}
        >
          <PhaseTimer phase={phase}/>
        </div>
        {/* Board below */}
        <div className="w-full z-10">
          <RouletteBoard
            bets={Object.fromEntries(bets.map((b) => [b.position, b.amount]))}
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
