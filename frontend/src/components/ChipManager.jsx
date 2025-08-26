import React, { useState, useMemo, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

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

  // 🔹 Reset lock & clear bets when a new round starts
  useEffect(() => {
    setBetLocked(false);
    setBets([]);
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
      if (betLocked || phase !== "betting") {
        toast.error("Betting is closed. Wait for next round.");
        return; // prevent adding bets after locking/when not betting
      }

      const betType = getBetTypeAndNumber(cellId);
      if (!betType) return;

      setBets((prev) => {
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
    [betLocked, phase]
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
    if (bets.length === 0) return;
    if (betLocked || phase !== "betting") {
      toast.error("Betting is closed. Wait for next round.");
      return;
    }
    const payload = { userId, bets };
    console.log("✅ Sending to backend:", payload);
    toast.success("Bet placed Successfully!")
    // socket.emit("placeBet", payload)
    setBetLocked(true); // lock after placing bet
    setBets([]); // clear chips from board after placing bet
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
  });
};

export default ChipManager;
