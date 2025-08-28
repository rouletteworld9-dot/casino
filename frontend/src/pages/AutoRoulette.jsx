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

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);
  const [showInsufficient, setShowInsufficient] = useState(true);

  useEffect(() => {
    // Check for balance property (adjust as needed for your user object)
    //change with 10 rs this is for testing purpose
    if (user && (user.balance !== undefined ? user.balance : user.wallet) < 10000) { 
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
      <InsufficientBalanceModal open={showInsufficient} onClose={() => setShowInsufficient(false)} />
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
        <div
          className="pt-20 overflow-hidden md:max-h-[100vh] rotate-0"
          style={{
            backgroundImage: "url('/game/roulettetable.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="absolute top-11 right-10">
            <LiveButton />
          </div>
          <ResultOverlay />
          {/* last results */}
          <div className="bg-black/10 absolute top-11 left-140 flex justify-center items-center">
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
          <ChipManager userId={user?._id} round={round}>
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
