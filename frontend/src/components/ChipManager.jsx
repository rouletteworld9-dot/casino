import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { toast } from "react-hot-toast";

const getBetTypeAndNumber = (cellId) => {
  if (/^\d+$/.test(cellId) && Number(cellId) >= 0 && Number(cellId) <= 36) {
    return { type: "straight", number: Number(cellId) };
  }
  if (cellId === "1st12") return { type: "dozen", number: 1 };
  if (cellId === "2nd12") return { type: "dozen", number: 2 };
  if (cellId === "3rd12") return { type: "dozen", number: 3 };
  if (cellId === "2to1_top") return { type: "column", number: 3 };
  if (cellId === "2to1_middle") return { type: "column", number: 2 };
  if (cellId === "2to1_bottom") return { type: "column", number: 1 };
  if (cellId === "1-18") return { type: "low" };
  if (cellId === "19-36") return { type: "high" };
  if (cellId === "even") return { type: "even" };
  if (cellId === "odd") return { type: "odd" };
  if (cellId === "red" || cellId === "black")
    return { type: "color", color: cellId };
  return null;
};

const ChipManager = ({ children, userId, round, phase }) => {
  const [selectedCoin, setSelectedCoin] = useState(10);
  const [bets, setBets] = useState([]);
  const [betLocked, setBetLocked] = useState(false);

  const [betHistory, setBetHistory] = useState([]); // for undo

  const { emitPlaceBet } = useGameSocket();

  // 🔹 Reset lock & clear bets when a new round starts
  useEffect(() => {
    setBetLocked(false);
    setBets([]);
    setBetHistory([]);
  }, [round]);

  // 🔹 Lock betting outside of betting phase
  useEffect(() => {
    if (phase !== "betting") {
      setBetLocked(true);
    } else {
      setBetLocked(false);
    }
  }, [phase]);

  const addBet = useCallback(
    (cellId, coinValue) => {
      if (betLocked) {
        return;
      }
      const betType = getBetTypeAndNumber(cellId);
      if (!betType) return;

      // Save current state to history BEFORE making changes
      setBetHistory((prev) => [...prev, bets]);

      setBets((prev) => {
        // --- Color (red/black) mutual exclusion ---
        if (
          cellId === "red" &&
          prev.find((b) => b.type === "color" && b.color === "black")
        ) {
          toast("You can only bet on one color at a time.");
          return prev;
        }
        if (
          cellId === "black" &&
          prev.find((b) => b.type === "color" && b.color === "red")
        ) {
          toast("You can only bet on one color at a time.");
          return prev;
        }
        // --- Column: only one column bet allowed ---
        if (
          betType.type === "column" &&
          prev.some((b) => b.type === "column" && b.number !== betType.number)
        ) {
          toast("You can only bet on one column at a time.");
          return prev;
        }
        // --- Dozen: only one dozen bet allowed ---
        if (
          betType.type === "dozen" &&
          prev.some((b) => b.type === "dozen" && b.number !== betType.number)
        ) {
          toast("You can only bet on one dozen at a time.");
          return prev;
        }
        // --- Low/High: mutually exclusive ---
        if (
          (betType.type === "low" && prev.some((b) => b.type === "high")) ||
          (betType.type === "high" && prev.some((b) => b.type === "low"))
        ) {
          toast("You can only bet on low or high, not both.");
          return prev;
        }
        // --- Even/Odd: mutually exclusive ---
        if (
          (betType.type === "even" && prev.some((b) => b.type === "odd")) ||
          (betType.type === "odd" && prev.some((b) => b.type === "even"))
        ) {
          toast("You can only bet on even or odd, not both.");
          return prev;
        }
        // --- Normal stacking logic for same bet (allow multiple chips on same bet) ---
        let matchFn =
          betType.type === "color"
            ? (b) => b.type === "color" && b.color === betType.color
            : (b) => b.type === betType.type && b.number === betType.number;
        const idx = prev.findIndex(matchFn);
        if (idx === -1) {
          return [
            ...prev,
            betType.type === "color"
              ? {
                  type: "color",
                  color: betType.color,
                  bets: [{ amount: coinValue }],
                }
              : {
                  type: betType.type,
                  number: betType.number,
                  bets: [{ amount: coinValue }],
                },
          ];
        }
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          bets: [...updated[idx].bets, { amount: coinValue }],
        };
        return updated;
      });
    },
    [betLocked, bets] // Added bets as dependency
  );

  // Double all bets
  const doubleBets = useCallback(() => {
    if (betLocked || bets.length === 0) return;
    
    // Save current state to history BEFORE making changes
    setBetHistory((prev) => [...prev, bets]);
    
    setBets((prev) =>
      prev.map((b) => ({
        ...b,
        bets: b.bets.concat(b.bets.map((a) => ({ ...a }))),
      }))
    );
    console.log("Double bets: ", bets);
  }, [betLocked, bets]);

  // Undo last action - Fixed version
  const undoBet = useCallback(() => {
    if (betLocked) return;
    
    setBetHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      
      // Get the last saved state
      const lastState = prevHistory[prevHistory.length - 1];
      
      // Restore the bets to the last saved state
      setBets(lastState);
      
      console.log("Undo last bet: Restoring to", lastState);
      
      // Remove the last history entry
      return prevHistory.slice(0, -1);
    });
  }, [betLocked]);

  const cellTotals = useMemo(() => {
    const totals = {};
    bets.forEach((b) => {
      let cellId =
        b.type === "straight"
          ? String(b.number)
          : b.type === "dozen"
            ? b.number === 1
              ? "1st12"
              : b.number === 2
                ? "2nd12"
                : "3rd12"
            : b.type === "column"
              ? b.number === 1
                ? "2to1_bottom"
                : b.number === 2
                  ? "2to1_middle"
                  : "2to1_top"
              : b.type === "low"
                ? "1-18"
                : b.type === "high"
                  ? "19-36"
                  : b.type === "even"
                    ? "even"
                    : b.type === "odd"
                      ? "odd"
                      : b.type === "color"
                        ? b.color
                        : null;

      if (cellId) totals[cellId] = b.bets.reduce((s, a) => s + a.amount, 0);
    });
    return totals;
  }, [bets]);

  const betsByCell = useMemo(() => {
    const out = {};
    bets.forEach((b) => {
      let cellId =
        b.type === "straight"
          ? String(b.number)
          : b.type === "dozen"
            ? b.number === 1
              ? "1st12"
              : b.number === 2
                ? "2nd12"
                : "3rd12"
            : b.type === "column"
              ? b.number === 1
                ? "2to1_bottom"
                : b.number === 2
                  ? "2to1_middle"
                  : "2to1_top"
              : b.type === "low"
                ? "1-18"
                : b.type === "high"
                  ? "19-36"
                  : b.type === "even"
                    ? "even"
                    : b.type === "odd"
                      ? "odd"
                      : b.type === "color"
                        ? b.color
                        : null;

      if (cellId) {
        out[cellId] = (out[cellId] || []).concat(b.bets.map((a) => a.amount));
      }
    });
    return out;
  }, [bets]);

  const placeBet = useCallback(() => {
    const mappedBets = bets.map((b) => {
      const amount = b.bets.reduce((sum, a) => sum + a.amount, 0);
      if (b.type === "color") {
        // Flatten color to its explicit type (red/black) with no number
        return { type: b.color, amount };
      }
      return { type: b.type, numbers: [b.number], amount };
    });
    const payload = { userId, bets: mappedBets };
    emitPlaceBet(payload);
    setBetLocked(true); // clear chips from board after placing bet
  }, [bets, userId, betLocked, phase]);

  return children({
    selectedCoin,
    setSelectedCoin,
    betsByCell,
    cellTotals,
    onCellClick: (cellId) => addBet(cellId, selectedCoin),
    onCellDrop: (cellId, value) => addBet(cellId, value),
    onPlaceBet: placeBet,
    hasBets: bets.length > 0,
    betLocked,
    onDoubleBets: doubleBets,
    onUndo: undoBet,
  });
};

export default ChipManager;