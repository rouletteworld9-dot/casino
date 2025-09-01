import { create } from "zustand";

export const setAmountStore = create((set) => ({
  totalBetAmount: 0,
  setTotalBetAmount: (amount) => set({ totalBetAmount: amount }),
}));