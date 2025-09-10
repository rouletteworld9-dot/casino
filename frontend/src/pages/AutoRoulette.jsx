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
import AutoRouletteTag from "../components/ui/AutoRouletteTag";

const AutoRoulette = () => {
  const [showWinMessage, setShowWinMessage] = useState(false);
  const winStatus = useGameStore((s) => s.winStatus);
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

  // Show win message 1s after result phase starts
  useEffect(() => {
    if (phase === "result" && winStatus?.isWin) {
      setShowWinMessage(false);
      const t = setTimeout(() => setShowWinMessage(true), 6000); // 6 seconds delay (5s for number, 1s after)
      return () => clearTimeout(t);
    } else {
      setShowWinMessage(false);
    }
  }, [phase, winStatus]);

  return (
    <div className="relative w-full flex flex-col h-[100dvh] top-0 overflow-hidden">
      <InsufficientBalanceModal />

      <div className="sm:block hidden ">
        <Header />
      </div>

      {loading ? (
        <div className="w-full sm:h-screen flex items-center justify-center bg-black">
          {/* Mobile image */}
          <img
            src="/game/rouletteLoadingMobile.jpeg"
            alt="loading"
            className="sm:hidden h-[100vh] w-full object-cover"
          />
          {/* Desktop image */}
          <img
            src="/game/rouletteLoading.webp"
            alt="loading"
            className="hidden sm:block h-[100vh] w-full object-cover"
          />
        </div>
      ) : (
        <div className="pt-20 overflow-hidden h-full md:max-h-[100vh] md:bg-[url(/game/roulettetable.webp)] bg-cover bg-center bg-gradient-to-t from-indigo-900 via-blue-950 to-black/80 ">
          <div className="absolute sm:top-10 top-4 sm:right-10 right-0">
            <LiveButton />
          </div>

          <MuteButton />
          {showWinMessage && <ResultOverlay />}
          {/* last results */}
          <div className="bg-black/5 gap-7 w-auto h-3 right-0 left-0 absolute top-0 sm:top-11 b-2 flex items-center justify-between">
            <LastResults />
          </div>

          {/* wheel */}
          <div className="h-30 relative w-full flex justify-center ">
            <ResultDisplay className="absolute sm:fixed z-80 top-0 sm:top-120" />

            <motion.div
              className="absolute sm:left-0 left-0 top-10 sm:top-0"
              initial={{ y: 0, opacity: 1 }}
              animate={
                phase === "betting"
                  ? { y: -20, opacity: 0.7, zIndex: 0 }
                  : { y: 0, opacity: 1, zIndex: 10 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
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
              hasBets,
              betLocked,
              onDoubleBets,
              onUndo,
            }) => (
              <>
                {phase === "betting" && (
                  <div className="fixed top-30 sm:top-128 sm:left-0 right-0 sm:w-full z-50 bg-transparent px-2 py-3 flex justify-center items-center ">
                    <div className="w-full max-w-2xl flex sm:flex-row flex-col items-center justify-center gap-2">
                      {/* 2x Button Far Left */}
                      <button
                        className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 sm:mr-2 cursor-pointer"
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
                      
                        hasBets={hasBets}
                        hidePlaceBet
                      />
                      {/* Undo Button Far Right */}
                      <button
                        className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 sm:ml-2 cursor-pointer"
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
                {/* Mobile only: bottom left text */}
                <div className="sm:hidden mb-0.2 fixed flex right-1 bottom-1 z-50 text-white text-xs px-1 py-1 rounded">
                  Auto Roulette ₹0 - ₹50,000
                </div>
              </>
            )}
          </ChipManager>
          {/* phase timer */}
          <div>
            {/* <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100"> */}
            <PhaseTimer />
          </div>
          {/* <AutoRouletteTag/> */}
        </div>
      )}
    </div>
  );
};

export default AutoRoulette;
