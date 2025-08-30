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
import {Undo2 } from 'lucide-react';

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);
  const [showInsufficient, setShowInsufficient] = useState(true);

  useEffect(() => {
    // Check for balance property (adjust as needed for your user object)
    //change with 10 rs this is for testing purpose
    if (
      user &&
      (user.balance !== undefined ? user.balance : user.wallet) < 10000
    ) {
      setShowInsufficient(true);
    }
  }, [user]);

  const { phase, round, lastResults, loading, setLoading } = useGameStore();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [setLoading]);
  return (
    <div className="relative w-full flex flex-col">
      <InsufficientBalanceModal
        open={showInsufficient}
        onClose={() => setShowInsufficient(false)}
      />
      <Header />
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center bg-black">
          <img
            src="/game/rouletteLoading.webp"
            alt="loading"
            className="bg-cover h-[100vh] w-full"
          />
        </div>
      ) : (
        <div className="pt-20 overflow-hidden md:max-h-[100vh] md:bg-[url(/game/roulettetable.webp)] bg-cover bg-center bg-gradient-to-b from-blue-600 to-blue-900">
          <div className="absolute top-2 right-10">
            <LiveButton />
          </div>
          <ResultOverlay />
          {/* last results */}
          <div className="bg-black/10 absolute top-2 left-140 flex justify-center items-center">
            <LastResults />
          </div>

          {/* wheel */}
          <div className="relative w-full flex justify-center">
            <div className="absolute left-0 z-60">
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
              onDoubleBets,
              onUndo,
            }) => (
              <>
                {phase === "betting" && (
                  <div className="fixed bottom-0 left-0 w-full z-50 bg-transparent px-2 py-3 flex justify-center items-center shadow-2xl">
                    <div className="w-full max-w-2xl flex flex-row items-center justify-center gap-2">
                      {/* 2x Button Far Left */}
                      <button
                        className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 mr-2 cursor-pointer"
                        onClick={onDoubleBets}
                        disabled={betLocked || !hasBets}
                        aria-label="Double Bets"
                      >
                        2x
                      </button>
                      {/* Chips Centered */}
                      <ChipSelector
                        selectedCoin={selectedCoin}
                        onSelect={setSelectedCoin}
                        betLocked={betLocked}
                        handlePlaceBet={onPlaceBet}
                        hasBets={hasBets}
                        hidePlaceBet
                      />
                      {/* Undo Button Far Right */}
                      <button
                        className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white font-bold shadow-md flex items-center justify-center transition-all duration-150 disabled:opacity-60 ml-2 cursor-pointer"
                        onClick={onUndo}
                        disabled={betLocked || !hasBets}
                        aria-label="Undo Bet"
                      >
                       <Undo2 />
                      </button>
                    </div>
                  </div>
                )}

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
