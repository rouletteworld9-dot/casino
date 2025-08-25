import React, { useCallback, useMemo, useState } from "react";
import Header from "../components/header";
import RouletteBoard from "./RouletteBoard";
import RouletteGame from "./roulette-game";
import ChipSelector from "../components/ui/ChipSelector";
import LastResults from "../components/ui/LastResults";
import { useAuthStore } from "../stores/useAuthStore";
import { useGameSocket } from "../hooks/useGameSocket";
import PhaseTimer from "../components/ui/PhaseTimer";

// Helper to map cellId to bet type/number
const getBetTypeAndNumber = (cellId) => {
  // Individual numbers
  if (/^\d+$/.test(cellId) && Number(cellId) >= 1 && Number(cellId) <= 36) {
    return { type: "straight", number: Number(cellId) };
  }
  // Dozens
  if (cellId === "1st12") return { type: "dozen", number: 1 };
  if (cellId === "2nd12") return { type: "dozen", number: 2 };
  if (cellId === "3rd12") return { type: "dozen", number: 3 };
  // Columns (right side)
  if (cellId === "2to1_top") return { type: "column", number: 3 };
  if (cellId === "2to1_middle") return { type: "column", number: 2 };
  if (cellId === "2to1_bottom") return { type: "column", number: 1 };
  // Low/high
  if (cellId === "1-18") return { type: "low", number: null };
  if (cellId === "19-36") return { type: "high", number: null };
  // Even/odd
  if (cellId === "even") return { type: "even", number: null };
  if (cellId === "odd") return { type: "odd", number: null };
  // Color
  if (cellId === "red" || cellId === "black") return { type: "color", number: null, color: cellId };
  // Zero
  if (cellId === "0") return { type: "straight", number: 0 };
  return null;
};

const AutoRoulette = () => {
  const user = useAuthStore((state) => state.user);
  const { phase } = useGameSocket(user?._id);
  const [selectedCoin, setSelectedCoin] = useState(10);
  // bets: { type, number, bets: [{amount}] }
  const [bets, setBets] = useState([]);
  const [betLocked, setBetLocked] = useState(false);

  // Add or update bet on cell click
  const handleCellClick = useCallback((cellId) => {
    if (betLocked || !selectedCoin) return;
    const betType = getBetTypeAndNumber(cellId);
    if (!betType) return;
    setBets((prev) => {
      // For color, type/color must be unique
      let matchFn;
      if (betType.type === "color") {
        matchFn = (b) => b.type === "color" && b.color === betType.color;
      } else {
        matchFn = (b) => b.type === betType.type && b.number === betType.number;
      }
      const idx = prev.findIndex(matchFn);
      if (idx === -1) {
        // New bet
        return [
          ...prev,
          betType.type === "color"
            ? { type: "color", number: 0, color: betType.color, bets: [{ amount: selectedCoin }] }
            : { type: betType.type, number: betType.number, bets: [{ amount: selectedCoin }] },
        ];
      } else {
        // Add to existing bet
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          bets: [...updated[idx].bets, { amount: selectedCoin }],
        };
        return updated;
      }
    });
  }, [betLocked, selectedCoin]);

  // Drag and drop support (same as click logic)
  const handleCellDrop = useCallback((cellId, coinValue) => {
    if (betLocked || !coinValue) return;
    const betType = getBetTypeAndNumber(cellId);
    if (!betType) return;
    setBets((prev) => {
      let matchFn;
      if (betType.type === "color") {
        matchFn = (b) => b.type === "color" && b.color === betType.color;
      } else {
        matchFn = (b) => b.type === betType.type && b.number === betType.number;
      }
      const idx = prev.findIndex(matchFn);
      if (idx === -1) {
        return [
          ...prev,
          betType.type === "color"
            ? { type: "color", number: 0, color: betType.color, bets: [{ amount: coinValue }] }
            : { type: betType.type, number: betType.number, bets: [{ amount: coinValue }] },
        ];
      } else {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          bets: [...updated[idx].bets, { amount: coinValue }],
        };
        return updated;
      }
    });
  }, [betLocked]);

  // Remove bet on right click (optional, not required by prompt)
  // const handleCellRightClick = useCallback((cellId) => {
  //   setBets((prev) => prev.filter(/* ... */));
  // }, []);

  // For display: cellTotals and bets per cellId
  const cellTotals = useMemo(() => {
    const totals = {};
    bets.forEach((b) => {
      // Map to cellId for display
      let cellId;
      if (b.type === "straight") cellId = String(b.number);
      else if (b.type === "dozen") cellId = `${b.number}st12`;
      else if (b.type === "column") cellId = b.number === 1 ? "2to1_bottom" : b.number === 2 ? "2to1_middle" : "2to1_top";
      else if (b.type === "low") cellId = "1-18";
      else if (b.type === "high") cellId = "19-36";
      else if (b.type === "even") cellId = "even";
      else if (b.type === "odd") cellId = "odd";
      else if (b.type === "color") cellId = b.color;
      else cellId = null;
      if (cellId)
        totals[cellId] = b.bets.reduce((sum, a) => sum + a.amount, 0);
    });
    return totals;
  }, [bets]);

  // For display: bets per cellId (for chips)
  const betsByCell = useMemo(() => {
    const out = {};
    bets.forEach((b) => {
      let cellId;
      if (b.type === "straight") cellId = String(b.number);
      else if (b.type === "dozen") cellId = `${b.number}st12`;
      else if (b.type === "column") cellId = b.number === 1 ? "2to1_bottom" : b.number === 2 ? "2to1_middle" : "2to1_top";
      else if (b.type === "low") cellId = "1-18";
      else if (b.type === "high") cellId = "19-36";
      else if (b.type === "even") cellId = "even";
      else if (b.type === "odd") cellId = "odd";
      else if (b.type === "color") cellId = b.color;
      else cellId = null;
      if (cellId)
        out[cellId] = b.bets.map((a) => a.amount);
    });
    return out;
  }, [bets]);

  // Total bet
  const totalBet = useMemo(
    () => bets.reduce((sum, b) => sum + b.bets.reduce((s, a) => s + a.amount, 0), 0),
    [bets]
  );

  // Place bet payload
  const betsPayload = useMemo(() => {
    return {
      userId: user?._id || "123",
      bets: bets.map((b) => {
        const out = { type: b.type, number: b.number, bets: b.bets };
        if (b.type === "color") out.color = b.color;
        return out;
      }),
    };
  }, [bets, user]);

  // Place Bet button handler

  const handlePlaceBet = () => {
    if (betLocked || bets.length === 0) return;
    setBetLocked(true);
    // TODO: send betsPayload to backend
    console.log("Bet Payload to backend:", betsPayload);
    // Optionally show toast/notification
    // After placing, clear bets so coins disappear from the board
    setBets([]);
  };

  return (
    <div className="relative w-full flex flex-col items-">
      <Header />
      <div
        className="pt-20 overflow-hidden max-h-[100vh]"
        // Only one background image here, not duplicated
        style={{
          backgroundImage: "url('/game/roulettetable.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
            <ChipSelector selectedCoin={selectedCoin} onSelect={setSelectedCoin} />
          </div>
        </div>
        <div className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-30 opacity-100`}>
          <PhaseTimer phase={phase} />
        </div>
        {/* Board below */}
        <div className="w-full z-10">
          <RouletteBoard
            bets={betsByCell}
            onCellClick={handleCellClick}
            onCellDrop={handleCellDrop}
            cellTotals={cellTotals}
          />
        </div>
        {/* Place Bet button: disable after placed, do not hide */}
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
          <button
            className={`px-8 py-2 rounded-full mt-7 mb-3 font-bold text-lg shadow-lg transition bg-gradient-to-r from-yellow-400 to-yellow-600 text-black border-2 border-yellow-700 ${betLocked || bets.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
            onClick={handlePlaceBet}
            disabled={betLocked || bets.length === 0}
          >
            Place Bet
          </button>
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
