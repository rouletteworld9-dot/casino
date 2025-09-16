import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useGameSocket } from "../hooks/useGameSocket";
import { toast } from "react-hot-toast";
import useCountdown from "../hooks/useCountdown";
import { setAmountStore } from "../stores/setAmountStore";

const getBetTypeAndNumber = (cellId) => {
  // Straight number bets
  if (/^\d+$/.test(cellId) && Number(cellId) >= 0 && Number(cellId) <= 36) {
    return { type: "straight", number: Number(cellId) };
  }

  // Handle split bets
  if (cellId.startsWith("split-")) {
    const numbers = cellId.replace("split-", "").split("-").map(Number);
    return { type: "split", numbers: numbers };
  }

  // Handle corner bets
  if (cellId.startsWith("corner-")) {
    const numbers = cellId.replace("corner-", "").split("-").map(Number);
    return { type: "corner", numbers: numbers };
  }

  // Handle street bets
  if (cellId.startsWith("street-")) {
    const numbers = cellId.replace("street-", "").split("-").map(Number);
    return { type: "street", numbers: numbers };
  }

  // Handle line bets
  if (cellId.startsWith("line-")) {
    const numbers = cellId.replace("line-", "").split("-").map(Number);
    return { type: "line", numbers: numbers };
  }

  // Existing bet types (these return objects with 'number' property, not 'numbers')
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
  // console.log(userId , "userid")
  const [selectedCoin, setSelectedCoin] = useState(10);
  // const [bets, setBets] = useState([]);
  const { bets, setBets } = setAmountStore((s) => s);
  const [betLocked, setBetLocked] = useState(false);
  const [betHistory, setBetHistory] = useState([]); // for undo
  const { emitPlaceBet } = useGameSocket();
  const { remaining } = useCountdown();

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

  // 🔹 Auto place bet at the end of betting phase
  useEffect(() => {
    // Only proceed if we have bets and we're transitioning away from betting phase
    if (
      phase === "betting" &&
      bets.length > 0 &&
      !betLocked &&
      remaining <= 1 &&
      remaining > 0
    ) {
      // Call placeBet logic directly here
      const mappedBets = bets.map((b) => {
        const amount = b.bets.reduce((sum, a) => sum + a?.amount, 0);
        if (b.type === "color") {
          return { type: b.color, amount };
        } else if (["split", "corner", "street", "line"].includes(b.type)) {
          return { type: b.type, numbers: b.numbers, amount };
        } else {
          return { type: b.type, numbers: [b.number], amount };
        }
      });

      const payload = { userId, bets: mappedBets };
      emitPlaceBet(payload);
      setBetLocked(true);
    }
  }, [phase, bets, betLocked, userId, emitPlaceBet, remaining]);

  const addBet = useCallback(
    (cellId, coinValue) => {
      if (betLocked) {
        return;
      }

      const betType = getBetTypeAndNumber(cellId);

      if (!betType) {
        return;
      }

      // FIRST: Save current bets to history BEFORE any state changes
      setBetHistory((prevHistory) => {
        const newHistory = [...prevHistory, bets];
        return newHistory;
      });

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
        // --- Column: allow up to 2 columns ---
        if (
          betType.type === "column" &&
          prev.filter((b) => b.type === "column" && b.number !== betType.number)
            .length >= 2
        ) {
          toast("You can only bet on up to two columns at a time.");
          return prev;
        }
        // --- Dozen: allow up to 2 dozens ---
        if (
          betType.type === "dozen" &&
          prev.filter((b) => b.type === "dozen" && b.number !== betType.number)
            .length >= 2
        ) {
          toast("You can only bet on up to two dozens at a time.");
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
        let matchFn;
        if (betType.type === "color") {
          matchFn = (b) => b.type === "color" && b.color === betType.color;
        } else if (betType.type === "straight") {
          matchFn = (b) => b.type === "straight" && b.number === betType.number;
        } else if (
          ["split", "corner", "street", "line"].includes(betType.type)
        ) {
          // These bet types have 'numbers' array
          matchFn = (b) =>
            b.type === betType.type &&
            b.numbers &&
            betType.numbers &&
            JSON.stringify(b.numbers.sort()) ===
              JSON.stringify(betType.numbers.sort());
        } else {
          // Other bet types have 'number' property
          matchFn = (b) =>
            b.type === betType.type && b.number === betType.number;
        }

        const idx = prev.findIndex(matchFn);

        if (idx === -1) {
          let newBet;

          // CREATE NEW BET
          if (betType.type === "color") {
            newBet = {
              type: "color",
              color: betType.color,
              bets: [{ amount: coinValue }],
            };
          } else if (
            ["split", "corner", "street", "line"].includes(betType.type)
          ) {
            newBet = {
              type: betType.type,
              numbers: betType.numbers,
              bets: [{ amount: coinValue }],
            };
          } else {
            newBet = {
              type: betType.type,
              number: betType.number,
              bets: [{ amount: coinValue }],
            };
          }
          const result = [...prev, newBet];
          return result;
        } else {
          // STACK ON EXISTING BET
          const updated = [...prev];
          const oldBet = updated[idx];

          updated[idx] = {
            ...updated[idx],
            bets: [...updated[idx].bets, { amount: coinValue }],
          };

          return updated;
        }
      });
    },
    [betLocked, bets]
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

      // Remove the last history entry
      return prevHistory.slice(0, -1);
    });
  }, [betLocked]);

  const cellTotals = useMemo(() => {
    const totals = {};

    bets.forEach((b, index) => {
      let cellId;
      if (b.type === "straight") {
        cellId = String(b.number);
      } else if (["split", "corner", "street", "line"].includes(b.type)) {
        // Use consistent sorting for cellId generation
        const sortedNumbers = [...b.numbers].sort((a, b) => a - b);
        cellId = `${b.type}-${sortedNumbers.join("-")}`;
      } else if (b.type === "dozen") {
        cellId = b.number === 1 ? "1st12" : b.number === 2 ? "2nd12" : "3rd12";
      } else if (b.type === "column") {
        cellId =
          b.number === 1
            ? "2to1_bottom"
            : b.number === 2
              ? "2to1_middle"
              : "2to1_top";
      } else if (b.type === "low") {
        cellId = "1-18";
      } else if (b.type === "high") {
        cellId = "19-36";
      } else if (b.type === "even") {
        cellId = "even";
      } else if (b.type === "odd") {
        cellId = "odd";
      } else if (b.type === "color") {
        cellId = b.color;
      }

      if (cellId) {
        const total = b.bets.reduce((s, a) => s + a?.amount, 0);
        totals[cellId] = total;
      }
    });

    return totals;
  }, [bets]);

  const betsByCell = useMemo(() => {
    const out = {};

    bets.forEach((b, index) => {
      let cellId;
      if (b.type === "straight") {
        cellId = String(b.number);
      } else if (["split", "corner", "street", "line"].includes(b.type)) {
        // Use consistent sorting for cellId generation
        const sortedNumbers = [...b.numbers].sort((a, b) => a - b);
        cellId = `${b.type}-${sortedNumbers.join("-")}`;
      } else if (b.type === "dozen") {
        cellId = b.number === 1 ? "1st12" : b.number === 2 ? "2nd12" : "3rd12";
      } else if (b.type === "column") {
        cellId =
          b.number === 1
            ? "2to1_bottom"
            : b.number === 2
              ? "2to1_middle"
              : "2to1_top";
      } else if (b.type === "low") {
        cellId = "1-18";
      } else if (b.type === "high") {
        cellId = "19-36";
      } else if (b.type === "even") {
        cellId = "even";
      } else if (b.type === "odd") {
        cellId = "odd";
      } else if (b.type === "color") {
        cellId = b.color;
      }

      if (cellId) {
        const amounts = b.bets.map((a) => a?.amount);
        out[cellId] = (out[cellId] || []).concat(amounts);
        console.log(`🎲 CellId: ${cellId}, Amounts: [${amounts.join(",")}]`);
      }
    });

    return out;
  }, [bets]);

  const placeBet = useCallback(() => {
    const mappedBets = bets.map((b, index) => {
      const amount = b.bets.reduce((sum, a) => sum + a?.amount, 0);

      if (b.type === "color") {
        return { type: b.color, amount };
      } else if (["split", "corner", "street", "line"].includes(b.type)) {
        return { type: b.type, numbers: b.numbers, amount };
      } else {
        return { type: b.type, numbers: [b.number], amount };
      }
    });

    const payload = { userId, bets: mappedBets };

    emitPlaceBet(payload);
    setBetLocked(true);
  }, [bets, userId, emitPlaceBet]);

  return children({
    selectedCoin,
    setSelectedCoin,
    betsByCell,
    cellTotals,
    onCellClick: (cellId) => addBet(cellId, selectedCoin),
    onCellDrop: (cellId, value) => addBet(cellId, value),
    hasBets: bets.length > 0,
    betLocked,
    onDoubleBets: doubleBets,
    onUndo: undoBet,
  });
};

export default ChipManager;
