import React, { useEffect, useState } from "react";
import InsufficientBalanceModal from "../components/InsufficientBalanceModal";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import ChipSelector from "../components/ui/ChipSelector";
import LastResults from "../components/ui/LastResults";
import { useAuthStore } from "../stores/useAuthStore";
import PhaseTimer from "../components/ui/PhaseTimer";
import WinnerList from "../components/WinnerList";
import ChipManager from "../components/ChipManager";
import ResultOverlay from "../components/ui/ResultOverlay";
import { useGameStore } from "../stores/useGameStore";
import LiveButton from "../components/ui/LiveButton";
import { Undo2 } from "lucide-react";
import MuteButton from "../components/MuteButton";
import ResultDisplay from "../components/ui/ResultDisplay";
import { motion } from "framer-motion";

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);

  const phase = useGameStore((s) => s.phase);
  const round = useGameStore((s) => s.round);
  const lastResults = useGameStore((s) => s.lastResults);
  const loading = useGameStore((s) => s.loading);
  const setLoading = useGameStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="relative w-full flex flex-col">
      <InsufficientBalanceModal />

      <div className="sm:block hidden ">
        <Header />
      </div>

      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-black">
          <img
            src="/game/rouletteLoading.webp"
            alt="loading"
            className="bg-cover h-[100vh] w-full"
          />
        </div>
      ) : (
        <div className="pt-20 overflow-hidden md:max-h-[100vh] md:bg-[url(/game/roulettetable.webp)] bg-cover bg-center bg-gradient-to-t from-indigo-900 via-blue-950 to-black/80 ">
          <div className="absolute sm:top-10 top-4 sm:right-10 right-0">
            <LiveButton />
          </div>

          <MuteButton />
          <ResultOverlay />
          {/* last results */}
          <div className="bg-black/10  left-5 absolute top-0 sm:top-11 sm:left-140 flex justify-center items-center">
            <LastResults />
          </div>

          {/* wheel */}
          <div className="h-30 relative w-full flex justify-center ">
            <ResultDisplay className="absolute sm:fixed z-80 top-0 sm:top-120" />

            <motion.div
              className={`
    absolute sm:left-0 left-8 
    transition-all duration-700 ease-in-out
    ${
      phase === "betting"
        ? "opacity-30 mt-10 sm:mt-0 sm:opacity-100 sm:-translate-y-0 -translate-y-5 z-0"
        : "opacity-100 translate-y-0 z-10 mt-5 sm:mt-0"
    }
  `}
              initial={{ scale: 1 }}
              animate={{
                // only animate on small screens
                scale:
                  (phase === "spinning" || phase === "result") &&
                  window.innerWidth < 640
                    ? [1, 1.4, 1] // zoom animation
                    : 1,
              }}
              transition={{
                duration: phase === "spinning" || phase === "result" ? 5 : 5,
                repeat:
                  phase === "spinning" || phase === "result" ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <RouletteGame />
            </motion.div>
          </div>

          {/* chips + board together */}
          <ChipManager userId={user?._id} round={round} phase={phase}>
            {({
              selectedCoin,
              setSelectedCoin,
              totalBetAmount,
              betsByCell,
              cellTotals,
              onCellClick,
              onCellDrop,
              onPlaceBet,
              hasBets,
              betLocked,
              onDoubleBets,
              onUndo,
            }) => (
              <>
                {phase === "betting" && (
                  <div className="fixed bottom-0 sm:-bottom-1 sm:left-0 right-0 sm:w-full z-50 bg-transparent px-2 py-3 flex justify-center items-center shadow-2xl">
                    <div className="w-full max-w-2xl flex sm:flex-row flex-col items-center justify-center gap-2">
                      {/* 2x Button Far Left */}
                      <button
                        className="w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 sm:mr-2 cursor-pointer"
                        onClick={onDoubleBets}
                        disabled={betLocked || !hasBets}
                        aria-label="Double Bets"
                      >
                        2x
                      </button>
                      {/* Chips Centered */}
                      <ChipSelector
                        bets={betsByCell}
                        selectedCoin={selectedCoin}
                        onSelect={setSelectedCoin}
                        betLocked={betLocked}
                        handlePlaceBet={onPlaceBet}
                        hasBets={hasBets}
                        hidePlaceBet
                      />
                      {/* Undo Button Far Right */}
                      <button
                        className="w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 sm:ml-2 cursor-pointer"
                        onClick={onUndo}
                        disabled={betLocked || !hasBets}
                        aria-label="Undo Bet"
                      >
                        <Undo2 />
                      </button>
                    </div>
                  </div>
                )}
                <WinnerList totalBetAmount={totalBetAmount} />

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
          <div>
            {/* <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100"> */}
            <PhaseTimer />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoRoulette;
