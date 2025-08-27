import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";

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

const ChipManager = ({ children, userId, round }) => {
  const [selectedCoin, setSelectedCoin] = useState(10);
  const [bets, setBets] = useState([]);
  const [betLocked, setBetLocked] = useState(false);
  const { emitPlaceBet } = useGameSocket();

  // 🔹 Reset lock & clear bets when a new round starts
  useEffect(() => {
    setBetLocked(false);
    setBets([]);
  }, [round]);

  const addBet = useCallback(
    (cellId, coinValue) => {
      if (betLocked) return; // prevent adding bets after locking

      const betType = getBetTypeAndNumber(cellId);
      if (!betType) return;

      setBets((prev) => {
        if (
          cellId === "red" &&
          prev.find((b) => b.type === "color" && b.color === "black")
        ) {
          return prev;
        }
        if (
          cellId === "black" &&
          prev.find((b) => b.type === "color" && b.color === "red")
        ) {
          return prev;
        }

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
    [betLocked]
  );

  const cellTotals = useMemo(() => {
    const totals = {};
    bets.forEach((b) => {
      let cellId =
        b.type === "straight"
          ? String(b.number)
          : b.type === "dozen"
            ? `${b.number}st12`
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
    Object.keys(cellTotals).forEach((id) => {
      out[id] = bets
        .find((b) => cellTotals[id] && cellTotals[id] > 0)
        ?.bets.map((a) => a.amount);
    });
    return out;
  }, [bets, cellTotals]);

  const placeBet = useCallback(() => {
    // if (bets.length === 0 || betLocked) return;

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

    emitPlaceBet(payload);
    setBetLocked(true); // lock after placing bet
  }, [bets, userId, betLocked]);

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
  });
};

export default ChipManager;
