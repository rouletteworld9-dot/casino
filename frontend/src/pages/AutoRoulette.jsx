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
import MuteButton from "../components/MuteButton";

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);

  const { phase, round, lastResults, loading, setLoading } = useGameStore();

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
        <div className="pt-20 overflow-hidden md:max-h-[100vh] md:bg-[url(/game/roulettetable.webp)] bg-cover bg-center bg-gradient-to-r from-blue-800 to-blue-900 ">
          <div className="absolute sm:top-10 top-4 sm:right-10 right-0">
            <LiveButton />
          </div>
          <MuteButton />
          <ResultOverlay />
          {/* last results */}
          <div className="bg-black/10 absolute top-0 sm:top-11 sm:left-140 flex justify-center items-center">
            <LastResults />
          </div>

          {/* wheel */}
          <div className="relative w-full flex justify-center">
            <div
              className={`
      absolute sm:left-0 left-10 transition-all duration-500 ease-in-out
      ${
        phase === "betting"
          ? "opacity-30 mt-10 sm:mt-0 sm:opacity-100 sm:-translate-y-0 -translate-y-5 z-0"
          : "opacity-100 translate-y-0 z-60 mt-5 sm:mt-0"
      }
    `}
            >
              <RouletteGame />
            </div>
          </div>

          {/* chips + board together */}
          <ChipManager userId={user?._id} round={round}>
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
            }) => (
              <>
                <div
                  className={`
                  fixed sm:left-1/2 right-2 sm:-translate-x-1/2 z-30
                  transition-all duration-700 ease-in-out
                  ${
                    phase === "betting"
                      ? "opacity-100 bottom-4 pointer-events-auto"
                      : "opacity-0 bottom-0 pointer-events-none"
                  }
                `}
                >
                  <div className="">
                    <ChipSelector
                      hasBets={hasBets}
                      handlePlaceBet={onPlaceBet}
                      selectedCoin={selectedCoin}
                      onSelect={setSelectedCoin}
                      betLocked={betLocked}
                    />
                  </div>
                </div>
                <WinnerList totalBetAmount={totalBetAmount}/>

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
          <div className="">
            {/* <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100"> */}
            <PhaseTimer />
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoRoulette;
