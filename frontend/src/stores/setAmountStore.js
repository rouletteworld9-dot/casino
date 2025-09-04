import { create } from "zustand";

export const setAmountStore = create((set) => ({
  bets: [],
  totalBetAmount: 0,
   setBets: (updater) =>
    set((state) => {
      const newBets =
        typeof updater === "function" ? updater(state.bets) : updater;

      // calculate total from bets
      const total = newBets.reduce((sum, bet) => {
        return (
          sum +
          bet.bets.reduce((innerSum, b) => innerSum + (b.amount || 0), 0)
        );
      }, 0);

      return {
        bets: newBets,
        totalBetAmount: total,
      };
    }),
  setTotalBetAmount: (amount) => set({ totalBetAmount: amount }),
}));
