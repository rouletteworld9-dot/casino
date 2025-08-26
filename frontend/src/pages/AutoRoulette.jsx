import React, { useEffect, useState } from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import ChipSelector from "../components/ui/ChipSelector";
import LastResults from "../components/ui/LastResults";
import { useAuthStore } from "../stores/useAuthStore";
import { useGameSocket } from "../hooks/useGameSocket";
import PhaseTimer from "../components/ui/PhaseTimer";
import WinnerList from "../components/WinnerList";
import ChipManager from "../components/ChipManager";

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);

  const { phase, round , lastResults} = useGameSocket(user?._id);

  // const [showSpinningWinners, setShowSpinningWinners] = useState(false);

  // useEffect(() => {
  //   if (phase === "spinning") {
  //     setShowSpinningWinners(true);
  //     const t = setTimeout(() => setShowSpinningWinners(false), 5000); // hide after 2s
  //     return () => clearTimeout(t);
  //   }
  // }, [phase]);

  return (
    <div className="relative w-full flex flex-col">
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
        {/* last results */}
        <div className="bg-black/10 absolute top-11 left-140 flex justify-center items-center">
          <LastResults />
        </div>

        {/* wheel */}
        <div className="relative w-full flex justify-center">
          <div className="absolute left-0 z-20">
            <RouletteGame />
          </div>
        </div>

        <WinnerList />
        {/* chips + board together */}
        <ChipManager userId={user?._id} round={round} phase={phase}>
          {({
            selectedCoin,
            setSelectedCoin,
            betsByCell,
            cellTotals,
            onCellClick,
            onCellDrop,
            onPlaceBet,
            hasBets,
            betLocked,
          }) => (
            <>
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
                <div className=" py-1 rounded-full ">
                  <ChipSelector
                    hasBets={hasBets}
                    handlePlaceBet={onPlaceBet}
                    selectedCoin={selectedCoin}
                    onSelect={setSelectedCoin}
                    betLocked={betLocked}
                  />
                </div>
              </div>

              <RouletteBoard
                bets={betsByCell}
                onCellClick={onCellClick}
                onCellDrop={onCellDrop}
                cellTotals={cellTotals}
                lastResults={lastResults}
              />
            </>
          )}
        </ChipManager>

        {/* phase timer */}
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100">
          <PhaseTimer phase={phase} />
        </div>
      </div>
    </div>
  );
};

export default AutoRoulette;
